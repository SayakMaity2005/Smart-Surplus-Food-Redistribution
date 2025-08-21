from sqlalchemy import Column, Integer, String
from surplus.database import Base

class Admin(Base):
    __tablename__ = "Admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(String)

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(String)
    