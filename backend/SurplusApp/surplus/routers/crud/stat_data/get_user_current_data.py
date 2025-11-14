from datetime import datetime, timezone
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from surplus.auth import get_current_user
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.get("/user/get-user-current-data/")
async def get_user_current_data(request_cookie: Request, db: Session = Depends(get_db)):
    token = request_cookie.cookies.get("surplus_access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    current_user = await get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    if current_user.role == "donate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to get user stat data")

    curr_user_current_data = db.query(models.UserCurrentData).filter(models.UserCurrentData.user_id == current_user.id).first()
    if not curr_user_current_data:
        curr_user_new_current_data = models.UserCurrentData(
            date=datetime.now(timezone.utc).isoformat(),
            active_requests = 0,
            user = current_user
        )
        db.add(curr_user_new_current_data)
        db.commit()
        return {"message": "Daily stat data accessed successfully", "data": curr_user_new_current_data}
    return {"message": "Daily stat data accessed successfully", "data": curr_user_current_data}