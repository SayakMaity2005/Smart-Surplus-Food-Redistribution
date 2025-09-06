from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from surplus.schemas import SelectItem
from surplus.routers.authentication.verify_session import verify_session

router = APIRouter()

@router.post("/user/select-item/")
async def add_item(request: SelectItem, request_cookie: Request, db: Session = Depends(get_db)):

    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to select items")
    
    # items_list = db.query(models.Item).filter(models.Item.admin_id == current_admin.id).all()
    selected_item = db.query(models.Item).filter(models.Item.id == request.item_id).first()
    if not selected_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    selected_item.select = True
    selected_item.user = current_user
    # selected_item.user_id = current_user.id
    db.commit()
    db.refresh(selected_item)
    return {"message": "Item selected successfully", "data": selected_item}

