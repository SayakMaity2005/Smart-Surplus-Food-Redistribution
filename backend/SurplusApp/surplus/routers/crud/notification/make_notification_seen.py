from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.get("/make-notification-seen/")
async def make_notification_seen(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        admin_notifications = db.query(models.AdminNotification).filter(models.AdminNotification.admin_id == current_user.id).all()
        for notification in admin_notifications:
            notification.seen = True
            db.commit()
        return {"message": "Admin notifications accessed successfully", "data": admin_notifications}
    else:
        user_notifications = db.query(models.UserNotification).filter(models.UserNotification.user_id == current_user.id).all()
        for notification in user_notifications:
            notification.seen = True
            db.commit()
        return {"message": "User notifications accessed successfully", "data": user_notifications}