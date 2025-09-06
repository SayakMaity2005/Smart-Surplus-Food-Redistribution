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
        select = False
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
    return {"message": "Items added successfully"}
