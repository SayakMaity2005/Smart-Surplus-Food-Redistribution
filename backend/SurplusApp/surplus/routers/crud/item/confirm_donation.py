from datetime import datetime, timezone
from fastapi import APIRouter, Request, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus.mail_config import configuration
from surplus import models
# from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
# import smtplib
from surplus.routers.mail_service.send_email import send_email


router = APIRouter()

class ConfirmItem(BaseModel):
    item_id: int
    user_id: int
    user_name: str
    user_username: str


@router.post("/admin/confirm-donation/")
async def confirm_donation(request: ConfirmItem, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to confirm donation")
    
    confirmed_item = db.query(models.SelectedItem).filter(models.SelectedItem.id == request.item_id).first()
    if not confirmed_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    # if confirmed_item.collect == True:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item already donated")
    if confirmed_item.admin_id != current_admin.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to confirm donation")
    
    expiry_time = datetime.fromisoformat(confirmed_item.expiry_time.replace("Z", "+00:00")).astimezone(timezone.utc)
    now_time = datetime.now(timezone.utc)
    if now_time >= expiry_time:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item already expired")
    
    # Access user
    user = db.query(models.User).filter(models.User.id == confirmed_item.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    
    first_state_id = confirmed_item.previous_state_id
    
    try:
        collected_item = models.CollectedItem(
            title = confirmed_item.title,
            type = confirmed_item.type,
            quantity = confirmed_item.quantity,
            unit = confirmed_item.unit,
            freshness_level = confirmed_item.freshness_level,
            pickup_location = confirmed_item.pickup_location,
            expiry_time = confirmed_item.expiry_time,
            timestamp = confirmed_item.timestamp,
            special_instruction = confirmed_item.special_instruction,
            image_url = confirmed_item.image_url,
            collection_time = datetime.now(timezone.utc).isoformat(),
            previous_state_id = confirmed_item.previous_state_id,
            percentage_quantity = confirmed_item.percentage_quantity
        )
        # collected_item.id = confirmed_item.id # retain same id for tracking
        collected_item.admin = current_admin
        collected_item.user = user
        db.add(collected_item)
        db.commit()
        db.delete(confirmed_item)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error in confirming donation {e}")
    # confirmed_item.collect = True

    # db.commit()
    db.refresh(collected_item)

    # Calculation of impact score
    all_collected_items = db.query(models.CollectedItem).filter(models.CollectedItem.admin_id == current_admin.id)
    total_distinct_items = 0
    total_qty_percentage = 0
    item_state_dict: dict = {}
    for collected_item in all_collected_items:
        state_id = collected_item.previous_state_id
        if not state_id in item_state_dict:
            item_state_dict[state_id] = 1
            total_distinct_items += 1
        total_qty_percentage += collected_item.percentage_quantity
    today_collected_items = list(filter(lambda item: datetime.fromisoformat(item.collection_time.replace("Z", "+00:00")).astimezone(timezone.utc).date() == datetime.now(timezone.utc).date() , all_collected_items))
    today_distinct_items = 0
    today_qty_percentage = 0
    today_item_state_dict: dict = {}
    for collected_item in today_collected_items:
        state_id = collected_item.previous_state_id
        if not state_id in today_item_state_dict:
            today_item_state_dict[state_id] = 1
            today_distinct_items += 1
        today_qty_percentage += collected_item.percentage_quantity

    today_imapact_score = today_qty_percentage/today_distinct_items
    monthly_impact_score = total_qty_percentage/total_distinct_items


    item = db.query(models.Item).filter(models.Item.id == first_state_id).first()
    selected_items = db.query(models.SelectedItem).filter(models.SelectedItem.previous_state_id == first_state_id).all()

    # update daily data
    curr_admin_daily_data = db.query(models.DailyData).filter(models.DailyData.admin_id == current_admin.id).all()
    curr_admin_today_data = None
    for daily_data in curr_admin_daily_data:
        date = datetime.fromisoformat(daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        added_date = datetime.fromisoformat(confirmed_item.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        if date == added_date:
            curr_admin_today_data = daily_data
            break
    if curr_admin_today_data:
        if not item and len(selected_items)==0:
            curr_admin_today_data.total_donations += 1
        else: curr_admin_today_data.partial_donation += 1
        curr_admin_today_data.impact_score = today_imapact_score
        # curr_admin_today_data.total_donations += 1
        db.commit()
    else:
        if not item and len(selected_items)==0:
            curr_admin_new_daily_data = models.DailyData(
                date=datetime.now(timezone.utc).isoformat(),
                total_donations = 1,
                partial_donation = 0,
                impact_score = today_imapact_score,
                items_provided = 1,
                admin=current_admin
            )
            db.add(curr_admin_new_daily_data)
        else:
            curr_admin_new_daily_data = models.DailyData(
                date=datetime.now(timezone.utc).isoformat(),
                total_donations = 0,
                partial_donation = 1,
                impact_score = today_imapact_score,
                items_provided = 1,
                admin=current_admin
            )
            db.add(curr_admin_new_daily_data)
        db.commit()

    # update monthly data
    curr_admin_monthly_data = db.query(models.MonthlyData).filter(models.MonthlyData.admin_id == current_admin.id).all()
    curr_admin_this_month_data = None
    for monthly_data in curr_admin_monthly_data:
        date = datetime.fromisoformat(monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        added_month = datetime.fromisoformat(confirmed_item.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc).month
        if date == added_month:
            curr_admin_this_month_data = monthly_data
            break
    if curr_admin_this_month_data:
        if not item and len(selected_items)==0:
            curr_admin_this_month_data.total_donations += 1
        else: curr_admin_this_month_data.partial_donation += 1
        curr_admin_this_month_data.impact_score = monthly_impact_score
        db.commit()
    else:
        if not item and len(selected_items)==0:
            curr_admin_new_monthly_data = models.MonthlyData(
                date=datetime.now(timezone.utc).isoformat(),
                total_donations = 1,
                partial_donation = 0,
                impact_score = monthly_impact_score,
                items_provided = 1,
                admin=current_admin
            )
            db.add(curr_admin_new_monthly_data)
        else:
            curr_admin_new_monthly_data = models.MonthlyData(
                date=datetime.now(timezone.utc).isoformat(),
                total_donations = 0,
                partial_donation = 1,
                impact_score = monthly_impact_score,
                items_provided = 1,
                admin=current_admin
            )
            db.add(curr_admin_new_monthly_data)
        db.commit()

    # update daily data for user
    curr_user_daily_data = db.query(models.UserDailyData).filter(models.UserDailyData.user_id == request.user_id).all()
    curr_user_today_data = None
    for user_daily_data in curr_user_daily_data:
        date = datetime.fromisoformat(user_daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        if date == datetime.now(timezone.utc).date():
            curr_user_today_data = user_daily_data
            break
    if curr_user_today_data:
        curr_user_today_data.items_received += 1
        db.commit()
    else:
        curr_user_new_daily_data = models.UserDailyData(
            date=datetime.now(timezone.utc).isoformat(),
            items_received = 1,
            user=request.user_id
        )
        db.add(curr_user_new_daily_data)
        db.commit()

    # update monthly data for user
    curr_user_monthly_data = db.query(models.UserMonthlyData).filter(models.UserMonthlyData.user_id == request.user_id).all()
    curr_user_this_month_data = None
    for user_monthly_data in curr_user_monthly_data:
        date = datetime.fromisoformat(user_monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        if date == datetime.now(timezone.utc).month:
            curr_user_this_month_data = user_monthly_data
            break
    if curr_user_this_month_data:
        curr_user_this_month_data.items_received += 1
        db.commit()
    else:
        curr_user_new_monthly_data = models.UserMonthlyData(
            date=datetime.now(timezone.utc).isoformat(),
            items_received = 1,
            user=request.user_id
        )
        db.add(curr_user_new_monthly_data)
        db.commit()

    # update user current data
    curr_user_current_data = db.query(models.UserCurrentData).filter(models.UserCurrentData.user_id == request.user_id).first()
    if curr_user_current_data:
        curr_user_current_data.active_requests -= 1 if curr_user_current_data.active_requests > 0 else 0
        db.commit()

    # Mail Sending --------------------------------------- ##
    email = str(request.user_username)
    try:
        send_email(
            str(request.user_username),
            "Selected Item Confirmation",
            f"Dear {request.user_name},\nYour selected food item, {confirmed_item.quantity}{confirmed_item.unit} {confirmed_item.title} has been confirmed by {current_admin.name}."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: Unknown Network Error [{str(e)}]")
    # message = MessageSchema(
    #     subject="Selected Item Confirmation",
    #     recipients=[email],
    #     body=f"Dear {request.user_name},\nYour selected food item, {confirmed_item.quantity}{confirmed_item.unit} {confirmed_item.title} has been confirmed by {current_admin.name}.",
    #     subtype="plain"
    # )
    # try:
    #     fm = FastMail(configuration)
    #     await fm.send_message(message)
    # except smtplib.SMTPRecipientsRefused:
    #     raise HTTPException(status_code=400, detail="Invalid email address")
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")
    
    # admin notification
    new_notification = models.AdminNotification(
        message = f"You have confirmed pickup for {confirmed_item.quantity}{confirmed_item.unit} {confirmed_item.title} to {request.user_name}",
        seen = False,
        timestamp =  datetime.now(timezone.utc).isoformat(),
        admin = current_admin
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    # user notification
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    new_notification = models.UserNotification(
        message = f"Your selected item, {confirmed_item.quantity}{confirmed_item.unit} {confirmed_item.title} has been confirmed for pickup by {current_admin.name}.",
        seen = False,
        timestamp =  datetime.now(timezone.utc).isoformat(),
        user = user
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    return {"message": "Donation confirmed successfully", "data": confirmed_item}
