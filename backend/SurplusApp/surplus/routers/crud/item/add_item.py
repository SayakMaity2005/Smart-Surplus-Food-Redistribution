from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.schemas import AddItemForm
from surplus.routers.authentication.verify_session import verify_session

router = APIRouter()

@router.post("/admin/add-item/")
async def add_item(request: AddItemForm, request_cookie: Request, db: Session = Depends(get_db)):
    new_item = models.Item(
        title = request.title,
        type = request.type,
        quantity = request.quantity,
        unit = request.unit,
        freshness_level = request.freshness_level,
        pickup_location = request.pickup_location,
        expiry_time = request.expiry_time,
        timestamp = request.timestamp,
        special_instruction = request.special_instruction,
        provided_quantity = request.quantity,
        image_url = request.image_url
    )
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to add item")
    new_item.admin = current_admin
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    # update daily data
    curr_admin_daily_data = db.query(models.DailyData).filter(models.DailyData.admin_id == current_admin.id).all()
    curr_admin_today_data = None
    for daily_data in curr_admin_daily_data:
        date = datetime.fromisoformat(daily_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).date()
        if date == datetime.now(timezone.utc).date():
            curr_admin_today_data = daily_data
            break
    if curr_admin_today_data:
        curr_admin_today_data.items_provided += 1
        db.commit()
    else:
        curr_admin_new_daily_data = models.DailyData(
            date=datetime.now(timezone.utc).isoformat(),
            total_donations = 0,
            partial_donation = 0,
            impact_score = 0,
            items_provided = 1 ,
            admin=current_admin
        )
        db.add(curr_admin_new_daily_data)
        db.commit()
    # update manthly data
    curr_admin_monthly_data = db.query(models.MonthlyData).filter(models.MonthlyData.admin_id == current_admin.id).all()
    curr_admin_this_month_data = None
    for monthly_data in curr_admin_monthly_data:
        date = datetime.fromisoformat(monthly_data.date.replace("Z", "+00:00")).astimezone(timezone.utc).month
        if date == datetime.now(timezone.utc).month:
            curr_admin_this_month_data = monthly_data
            break
    if curr_admin_this_month_data:
        curr_admin_this_month_data.items_provided += 1
        db.commit()
    else:
        curr_admin_new_monthly_data = models.MonthlyData(
            date=datetime.now(timezone.utc).isoformat(),
            total_donations=0,
            partial_donation = 0,
            impact_score = 0,
            items_provided=1,
            admin=current_admin
        )
        db.add(curr_admin_new_monthly_data)
        db.commit()
    return {"message": "Item added successfully"}
