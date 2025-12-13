from datetime import datetime, timezone
import random
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from surplus import models
from surplus.database import get_db
from sqlalchemy.orm import Session
from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
from dotenv import load_dotenv
import os
import smtplib
from surplus.routers.mail_service.send_email import send_email

load_dotenv()

# conf = ConnectionConfig(
#     MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
#     MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
#     MAIL_FROM=os.getenv("MAIL_FROM"),
#     MAIL_PORT=int(os.getenv("MAIL_PORT")),
#     MAIL_SERVER=os.getenv("MAIL_SERVER"),
#     MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
#     MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
#     USE_CREDENTIALS=os.getenv("USE_CREDENTIALS") == "True"
# )

router = APIRouter()

class User(BaseModel):
    username: str
    name: str
    email_subject_otp: str
    email_body_otp: str

@router.post("/generate-otp/")
async def generate_otp(request: User, db: Session = Depends(get_db)):

    otp = "".join(random.choices("0123456789", k=6))

    # Mail Sending --------------------------------------- ##
    email = str(request.username)
    try:
        send_email(
            email,
            request.email_subject_otp,
            f"{request.email_body_otp} - {otp}\nThis OTP is valid for 10 minutes."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: Unknown Network Error [{str(e)}]")
    # message = MessageSchema(
    #     subject=request.email_subject_otp,
    #     recipients=[email],
    #     # body=f"Dear {request.name},\nYour OTP for registration to FoodSurplus is - {otp}\nThis OTP is valid for 10 minutes.",
    #     body=f"{request.email_body_otp} - {otp}\nThis OTP is valid for 10 minutes.",
    #     subtype="plain"
    # )

    # try:
    #     fm = FastMail(conf)
    #     await fm.send_message(message)
    # except smtplib.SMTPRecipientsRefused:
    #     raise HTTPException(status_code=400, detail="Invalid email address")
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")


    now = datetime.now(timezone.utc).isoformat()
    db.query(models.OtpData).delete() # delete previous otp if any
    db.commit()
    newOtp = models.OtpData(otp = otp, timestamp = now)
    db.add(newOtp)
    db.commit()
    return {"message": f"otp sent to {request.username}"}