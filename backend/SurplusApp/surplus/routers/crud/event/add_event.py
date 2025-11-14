from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, HTTPException, status
from surplus.auth import get_current_user
from sqlalchemy.orm import Session
from surplus.schemas import RequestEvent
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.post("/admin/add-event/")
async def add_event(request: RequestEvent, request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_admin = await get_current_user(token, db)
    if not current_admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_admin.role != "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to add event")
    new_event = models.AdminUpcomingEvent(
        title=request.title,
        description=request.description,
        location=request.location,
        timestamp=datetime.now(timezone.utc).isoformat(),
        event_date=request.event_date,
        admin=current_admin
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {"message": "Event added successfully"}
    
    