from urllib import request
from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import datetime, timezone
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus.mail_config import configuration
from surplus import models
from sqlalchemy.orm import Session
from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
import smtplib

# router = APIRouter()

# @router.get("/remove-expired-item/")
async def remove_expired_item(db: Session = Depends(get_db)):
    # token = request_cookie.cookies.get("surplus_access_token")
    # if not token:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    # current_admin = await get_current_user(token, db)
    # if not current_admin:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    
    now = datetime.now(timezone.utc)

    # all items -> filter expired items
    all_items = db.query(models.Item).all()
    expired_items = []
    expired_items_quantity = []
    expired_selected_items = []
    for item in all_items:
        if item.expiry_time:
            expiry_time = datetime.fromisoformat(item.expiry_time.replace("Z", "+00:00")).astimezone(timezone.utc)
            if expiry_time <= now:
                expired_items.append(item)
                quantity = item.quantity
                expired_selected_items = db.query(models.SelectedItem).filter(models.SelectedItem.previous_state_id == item.id)
                for selected_item in expired_selected_items:
                    quantity += selected_item.quantity
                    if selected_item.user_id:
                        # update user_current_data
                        # change in college from item to selected_item line 42
                        curr_user_current_data = db.query(models.UserCurrentData).filter(models.UserCurrentData.user_id == selected_item.user_id).first()
                        if curr_user_current_data:
                            curr_user_current_data.active_requests -= 1 if curr_user_current_data.active_requests > 0 else 0
                            db.commit()
                        # user notification
                        new_user_notification = models.UserNotification(
                            message = f"Your selected item {selected_item.quantity}{selected_item.unit} {selected_item.title} has expired",
                            seen = False,
                            timestamp =  datetime.now(timezone.utc).isoformat(),
                            user = selected_item.user
                        )
                        db.add(new_user_notification)
                        db.commit()
                        db.refresh(new_user_notification)
                    try:
                        db.delete(selected_item)
                        db.commit()
                    except:
                        db.rollback()
                        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired selected item")
                expired_items_quantity.append(quantity)
    idx = 0
    for item in expired_items:
        # admin notification
        new_admin_notification = models.AdminNotification(
            message = f"Item {expired_items_quantity[idx]}{item.unit} {item.title} has expired",
            seen = False,
            timestamp =  datetime.now(timezone.utc).isoformat(),
            admin = item.admin
        )
        db.add(new_admin_notification)
        db.commit()
        db.refresh(new_admin_notification)
        try:
            exp_item = models.ExpiredItem(
                title = item.title,
                type = item.type,
                quantity = expired_items_quantity[idx],
                unit = item.unit,
                freshness_level = item.freshness_level,
                pickup_location = item.pickup_location,
                expiry_time = item.expiry_time,
                timestamp = item.timestamp,
                special_instruction = item.special_instruction,
                image_url = item.image_url
            )
            exp_item.admin = item.admin
            db.add(exp_item)
            db.commit()
            db.refresh(exp_item)
            db.delete(item)
            db.commit()
        except:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired item")
        idx+=1
        




    # all selected items -> filter expired items which are selected by users
    all_selected_items:models.SelectedItem = db.query(models.SelectedItem).all()
    # expired_partial_selected_items = [] ###############################################
    expired_selected_items:models.SelectedItem = []
    # expired_selected_items_quantity = [] ################################################
    for item in all_selected_items:
        if item.expiry_time:
            expiry_time = datetime.fromisoformat(item.expiry_time.replace("Z", "+00:00")).astimezone(timezone.utc)
            if expiry_time <= now:
                expired_selected_items.append(item)
                # //////////////////////////////////////////// #
                # //////////////////////////////////////////// #
                # update user current data if item is selected
                if item.user_id:
                    curr_user_current_data = db.query(models.UserCurrentData).filter(models.UserCurrentData.user_id == item.user_id).first()
                    if curr_user_current_data:
                        curr_user_current_data.active_requests -= 1 if curr_user_current_data.active_requests > 0 else 0
                        db.commit()

    expired_selected_items.sort(key=lambda item: item.previous_state_id)
    idx = 0
    prev_item:models.SelectedItem = expired_selected_items[0] if expired_selected_items else None
    for item in expired_selected_items:
        if idx==0: continue
        if item.previous_state_id == prev_item.previous_state_id:
            prev_item.quantity+=item.quantity
            # if item.user_id:
            #     # user notification
            #     new_user_notification = models.UserNotification(
            #         message = f"Your selected item {item.quantity}{item.unit} {item.title} has expired",
            #         seen = False,
            #         timestamp =  datetime.now(timezone.utc).isoformat(),
            #         user = item.user
            #     )
            #     db.add(new_user_notification)
            #     db.commit()
            #     db.refresh(new_user_notification)
        else:
            # admin notification
            new_admin_notification = models.AdminNotification(
                message = f"Item {prev_item.quantity}{prev_item.unit} {prev_item.title} has expired",
                seen = False,
                timestamp =  datetime.now(timezone.utc).isoformat(),
                admin = prev_item.admin
            )
            db.add(new_admin_notification)
            db.commit()
            db.refresh(new_admin_notification)
            is_item_removed = False
            try:
                exp_item = models.ExpiredItem(
                    title = prev_item.title,
                    type = prev_item.type,
                    quantity = prev_item.quantity, # item.quantity,
                    unit = prev_item.unit,
                    freshness_level = prev_item.freshness_level,
                    pickup_location = prev_item.pickup_location,
                    expiry_time = prev_item.expiry_time,
                    timestamp = prev_item.timestamp,
                    special_instruction = prev_item.special_instruction,
                    image_url = prev_item.image_url
                )
                # exp_item.id = item.id  # retain the same ID
                exp_item.admin = prev_item.admin
                db.add(exp_item)
                db.commit()
                db.refresh(exp_item)
            except:
                db.rollback()
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired selected item")
            prev_item = item

    if prev_item:
        # admin notification
        new_admin_notification = models.AdminNotification(
            message = f"Item {prev_item.quantity}{prev_item.unit} {prev_item.title} has expired",
            seen = False,
            timestamp =  datetime.now(timezone.utc).isoformat(),
            admin = prev_item.admin
        )
        db.add(new_admin_notification)
        db.commit()
        db.refresh(new_admin_notification)
        try:
            exp_item = models.ExpiredItem(
                title = prev_item.title,
                type = prev_item.type,
                quantity = prev_item.quantity, # item.quantity,
                unit = prev_item.unit,
                freshness_level = prev_item.freshness_level,
                pickup_location = prev_item.pickup_location,
                expiry_time = prev_item.expiry_time,
                timestamp = prev_item.timestamp,
                special_instruction = prev_item.special_instruction,
                image_url = prev_item.image_url
            )
            # exp_item.id = item.id  # retain the same ID
            exp_item.admin = prev_item.admin
            db.add(exp_item)
            db.commit()
            db.refresh(exp_item)
        except:
            db.rollback()
            # raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired selected item")
    
    error:str = None
    for item in expired_selected_items:
        is_item_removed = False
        try:
            db.delete(item)
            db.commit()
            is_item_removed = True
            if is_item_removed and item.user_id:
                # user notification
                new_user_notification = models.UserNotification(
                    message = f"Your selected item {item.quantity} {item.unit} {item.title} has expired",
                    seen = False,
                    timestamp =  datetime.now(timezone.utc).isoformat(),
                    user = item.user
                )
                db.add(new_user_notification)
                db.commit()
                db.refresh(new_user_notification)
        except:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired selected item")
        user = db.query(models.User).filter(models.User.id == item.user_id).first()
        if is_item_removed:
            # Mail Sending --------------------------------------- ##
            email = str(user.username)
            message = MessageSchema(
                subject="Selected Item Expired",
                recipients=[email],
                body=f"Dear {request.name},\nYour selected food item {item.quantity} {item.unit} {item.title} has expired and removed from your selected items list in portal.",
                subtype="plain"
            )
            try:
                fm = FastMail(configuration)
                await fm.send_message(message)
            except smtplib.SMTPRecipientsRefused:
                # raise HTTPException(status_code=400, detail="Invalid email address")
                error = "Invalid email address"
            except Exception as e:
                # raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")
                error = f"Email sending failed: {str(e)}"
            
    # for item in expired_partial_selected_items:
    #     try:
    #         db.delete(item)
    #         db.commit()
    #     except:
    #         db.rollback()
    #         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error in removal of expired item")
 

    
    

    return {"message": "Expired Items removed successfully", "worning": error}
    

