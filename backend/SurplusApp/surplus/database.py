from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_FILE_PATH = "./surplus.db"
# DATABASE_URL = f"sqlite:///{DATABASE_FILE_PATH}"
DATABASE_URL = os.getenv("DATABASE_URL")
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()