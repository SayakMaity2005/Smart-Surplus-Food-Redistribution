from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from surplus.database import get_db
from surplus import models

router = APIRouter()

class OTPRequest(BaseModel):
    otp: str

@router.post("/verify-otp/")
async def verify_otp(request: OTPRequest, db: Session = Depends(get_db)):
    otp_data = db.query(models.OtpData).filter(models.OtpData.otp == request.otp).first()
    if not otp_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP")
    otp_gen_time = datetime.fromisoformat(otp_data.timestamp.replace("Z", "+00:00")).astimezone(timezone.utc) # converting offset-naive to offset-aware datetimes
    now = datetime.now(timezone.utc)
    if now > otp_gen_time + timedelta(minutes=10):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="OTP expired")
    db.query(models.OtpData).delete()
    db.commit()
    return {"message": "Otp verified successfully"}