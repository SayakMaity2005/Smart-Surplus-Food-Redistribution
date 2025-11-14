from fastapi import APIRouter, Request, HTTPException, status, Depends
from surplus.database import get_db
from surplus.auth import get_current_user
from surplus.schemas import ItemUser
from surplus import models
from sqlalchemy.orm import session
from sqlalchemy import and_

router = APIRouter()

@router.get("/user/get-selected-items-user/")
async def get_selected_items_user(request_cookie: Request, db: session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to see user selected items")
    user_selected_items: ItemUser = db.query(models.SelectedItem).filter(models.SelectedItem.user_id == current_user.id).all()
    for item in user_selected_items:
        admin = db.query(models.Admin).filter(models.Admin.id == item.admin_id).first()
        if admin:
            item.admin_name = admin.name
            item.admin_username = admin.username
            item.admin_contact = admin.contact
    return {"message": "Selected Items accesed successfully", "data": user_selected_items}
