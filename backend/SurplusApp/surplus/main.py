from fastapi import FastAPI
from surplus import models
from surplus.database import engine
from surplus.routers import register, login, logout, verify_session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(verify_session.router)

models.Base.metadata.create_all(bind=engine)