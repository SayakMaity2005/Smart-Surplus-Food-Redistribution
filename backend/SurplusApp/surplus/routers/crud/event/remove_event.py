from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from surplus import models
from sqlalchemy import and_
from sqlalchemy.orm import Session
from surplus.database import get_db
from surplus.auth import get_current_user

router = APIRouter()

class EventId(BaseModel):
    event_id: int

@router.post("/admin/remove-event/")
async def remove_event(request: EventId, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to remove event")
    
    event = db.query(models.AdminUpcomingEvent).filter(and_(models.AdminUpcomingEvent.id == request.event_id, models.AdminUpcomingEvent.admin_id == current_admin.id)).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event removed successfully"}