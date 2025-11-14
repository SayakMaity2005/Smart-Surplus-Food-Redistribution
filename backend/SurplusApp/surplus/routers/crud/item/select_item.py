from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.schemas import ItemId
from surplus.routers.authentication.verify_session import verify_session

router = APIRouter()

class SelectItemRequest(BaseModel):
    item_id: int
    quantity: float

@router.post("/user/select-item/")
async def add_item(request: SelectItemRequest, request_cookie: Request, db: Session = Depends(get_db)):

    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to select items")
    
    # items_list = db.query(models.Item).filter(models.Item.admin_id == current_admin.id).all()
    item = db.query(models.Item).filter(models.Item.id == request.item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item already selected or not in database")

    # selected_item.user_id = current_user.id
    selected_item = models.SelectedItem(
        title = item.title,
        type = item.type,
        quantity = request.quantity,
        unit = item.unit,
        freshness_level = item.freshness_level,
        pickup_location = item.pickup_location,
        expiry_time = item.expiry_time,
        special_instruction = item.special_instruction,
        timestamp = item.timestamp,
        image_url = item.image_url,
        admin_id = item.admin_id,
        selection_time = datetime.now(timezone.utc).isoformat(),
        previous_state_id = item.id,
        percentage_quantity = (request.quantity*100)/item.provided_quantity
    )
    # selected_item.id = item.id  # retain same id for tracking
    admin = db.query(models.Admin).filter(models.Admin.id == item.admin_id).first()
    selected_item.user = current_user
    selected_item.admin = admin
    db.add(selected_item)
    db.commit()
    db.refresh(selected_item)
    if request.quantity == item.quantity:
        db.delete(item)
    else:
        item.quantity -= request.quantity
    db.commit()

    # update daily data for user
    curr_user_current_data = db.query(models.UserCurrentData).filter(models.UserCurrentData.user_id == current_user.id).first()
    if curr_user_current_data:
        curr_user_current_data.active_requests += 1
        db.commit()
    else:
        curr_user_new_current_data = models.UserCurrentData(
            date=datetime.now(timezone.utc).isoformat(),
            active_requests = 1,
            user=current_user
        )
        db.add(curr_user_new_current_data)
        db.commit()

    # admin notification
    admin = db.query(models.Admin).filter(models.Admin.id == item.admin_id).first()
    new_notification = models.AdminNotification(
        message = f"Item, {request.quantity}{item.unit} {item.title} is Selected by {current_user.name}",
        seen = False,
        timestamp =  datetime.now(timezone.utc).isoformat(),
        admin = admin
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)


    return {"message": "Item selected successfully", "data": item}

