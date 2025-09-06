from datetime import timedelta
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from surplus.auth import get_user, create_access_token
from surplus.database import get_db
from surplus.security import Hash
from surplus.schemas import LoginForm, VerifiedUser

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 2
VALIDATION_TIME = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

ACCESS_TOKEN_EXPIRE_WEEKS = 1
VALIDATION_TIME = timedelta(weeks=ACCESS_TOKEN_EXPIRE_WEEKS)

@router.post("/login/")
async def login(response: Response, request: LoginForm, db: Session = Depends(get_db)):
    user = get_user(request.username, db)
    if not user or not Hash.verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incorrect username or password"
        )
    
    access_token_expires = VALIDATION_TIME
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="surplus_access_token",
        value=access_token,
        httponly=True,   # JS can't read
        secure=True,    # in production True (HTTPS only)
        samesite="None"
    )
    verifiedUser = VerifiedUser(
        name=user.name,
        username=user.username,
        role=user.role
    )
    return {"status":"ok","message": "Login successful!", "user": verifiedUser}