from fastapi import APIRouter, Request, Depends, HTTPException, status
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models
from sqlalchemy.orm import Session

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
    items_list = db.query(models.Item).filter(models.Item.admin_id == current_admin.id).all()
    return {"message": "Items accesed successfully", "data": items_list}