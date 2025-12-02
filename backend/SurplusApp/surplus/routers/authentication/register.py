from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from surplus.auth import create_access_token
from surplus.schemas import RegisterForm
from surplus.database import get_db
from surplus.security import Hash
from surplus import models
from fastapi_mail import FastMail,MessageSchema,ConnectionConfig
from dotenv import load_dotenv
import os
import smtplib

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS") == "True"
)

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 5
VALIDATION_TIME = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

ACCESS_TOKEN_EXPIRE_WEEKS = 1
VALIDATION_TIME = timedelta(weeks=ACCESS_TOKEN_EXPIRE_WEEKS)

@router.post("/register/")
async def register(response: Response, request: RegisterForm, db: Session = Depends(get_db)):
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
    
    if request.role == "donate":
        new_admin = models.Admin(
            name=request.name,
            username=request.username,
            password=Hash.hash_password(request.password),
            role=request.role,
            contact = request.contact
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        # Mail Sending --------------------------------------- ##
        email = str(request.username)    
        message = MessageSchema(
            subject="Registration Successful",
            recipients=[email],
            body=f"Dear {request.name},\nYou are successfully registered as Donor!!\nThank you For registering to Surplus Food Portal\nWelcome to our new journey",
            subtype="plain"
        )
        try:
            fm = FastMail(conf)
            await fm.send_message(message)
        except smtplib.SMTPRecipientsRefused:
            raise HTTPException(status_code=400, detail="Invalid email address")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")
        
        # admin notification
        new_notification = models.AdminNotification(
            message = "Registration Successful as Donor",
            seen = False,
            timestamp =  datetime.now(timezone.utc).isoformat(),
            admin = new_admin
        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)

    else:
        new_user = models.User(
            name=request.name,
            username=request.username,
            password=Hash.hash_password(request.password),
            role=request.role,
            contact = request.contact
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        #Mail Sending --------------------------------------- ##
        email = str(request.username)    
        message = MessageSchema(
            subject="Registration Successful",
            recipients=[email],
            body=f"Dear {request.name},\nYou are successfully registered as User!!\nThank you For registering to Surplus Food Portal\nWelcome to our new journey",
            subtype="plain"
        )
        try:
            fm = FastMail(conf)
            await fm.send_message(message)
        except smtplib.SMTPRecipientsRefused:
            raise HTTPException(status_code=400, detail="Invalid email address")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Email sending failed: Unknown Network Error")
        
        # user notification
        new_notification = models.UserNotification(
            message = "Registration Successful as User",
            seen = False,
            timestamp = datetime.now(timezone.utc).isoformat(),
            user = new_user
        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)

    access_token_expires = VALIDATION_TIME
    access_token = create_access_token(
        data={"sub": request.username}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="surplus_access_token",
        value=access_token,
        httponly=True,   # JS can't read
        secure=True,    # in production True (HTTPS only)
        samesite="None",
        path="/"  # Ensure the cookie is accessible across the app
    )
    return {"status":"ok","message": "Registration successful!"}
    # return Token(access_token=access_token, token_type="bearer")
    