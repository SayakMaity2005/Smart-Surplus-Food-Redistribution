from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from surplus import models
from sqlalchemy import and_
from sqlalchemy.orm import Session
from surplus.database import get_db
from surplus.auth import get_current_user

router = APIRouter()

class AdminEvent(BaseModel):
    id: int
    title: str
    description: str
    location: str
    event_date: str

@router.get("/admin/get-all-events/")
async def get_all_events(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to remove event")

    events: AdminEvent = db.query(models.AdminUpcomingEvent).filter(models.AdminUpcomingEvent.admin_id == current_admin.id).all()

    return {"message": "Events accessed successfully", "data": events}