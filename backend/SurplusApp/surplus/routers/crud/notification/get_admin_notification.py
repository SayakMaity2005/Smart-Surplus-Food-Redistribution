from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.get("/admin/get-admin-notification/")
async def get_admin_notification(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to see user notifications")

    admin_notifications = db.query(models.AdminNotification).filter(models.AdminNotification.admin_id == current_admin.id).all()

    isUnseen: bool = False
    # filter out notifications older than 1 week
    for notification in admin_notifications:
        timestamp = datetime.fromisoformat(notification.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc)
        now = datetime.now(timezone.utc)
        if now - timestamp > timedelta(weeks=1):
            db.delete(notification)
            db.commit()
        else:
            if not notification.seen: isUnseen = True
    admin_notifications = db.query(models.AdminNotification).filter(models.AdminNotification.admin_id == current_admin.id).all()
    return {"message": "Admin notifications accessed successfully", "data": admin_notifications, "isUnseen": isUnseen}