from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from surplus.schemas import RegisterForm
from surplus.database import get_db
from surplus import models

router = APIRouter()

@router.post("/check-registration-request/")
async def check_registration_request(response: Response, request: RegisterForm, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.username == request.username).first()
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if admin:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"Admin with username {admin.username} already registered"
        )
    if user:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"User with username {user.username} already registered"
        )
    if request.password != request.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password mismatch"
        )

    return {"status":"ok","message": "Yes, can be registered"}
    