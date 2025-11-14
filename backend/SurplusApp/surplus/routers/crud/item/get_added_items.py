from fastapi import APIRouter, Request, Depends, HTTPException, status
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus.schemas import ItemAdmin
from surplus import models
from sqlalchemy.orm import Session
from sqlalchemy import and_

router = APIRouter()

@router.get("/admin/get-added-items/")
async def get_added_items(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to see added items")
    items_list: ItemAdmin = db.query(models.Item).filter(models.Item.admin_id == current_admin.id).all()
    selected_items_list: ItemAdmin = db.query(models.SelectedItem).filter(models.SelectedItem.admin_id == current_admin.id).all()
    for item in selected_items_list:
        user = db.query(models.User).filter(models.User.id == item.user_id).first()
        if user:
            item.user_name = user.name
            item.user_username = user.username
            item.user_contact = user.contact
    return {"message": "Items accesed successfully", "data": {"items": items_list, "selected_items": selected_items_list}}