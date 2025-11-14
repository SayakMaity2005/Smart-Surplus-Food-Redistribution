from fastapi import APIRouter, Request, Depends, HTTPException, status
from surplus.schemas import ItemUser
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from sqlalchemy.orm import Session
from sqlalchemy import and_

router = APIRouter()

@router.get("/user/get-all-items/")
async def get_added_items(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to see items list")
    items_list: ItemUser = db.query(models.Item).all()
    for item in items_list:
        admin = db.query(models.Admin).filter(models.Admin.id == item.admin_id).first()
        if admin:
            item.admin_name = admin.name
            item.admin_username = admin.username
            item.admin_contact = admin.contact
    return {"message": "Items accesed successfully", "data": items_list}