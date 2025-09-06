from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from surplus.database import Base
from sqlalchemy.orm import relationship

class Admin(Base):
    __tablename__ = "Admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(String)
    items_added = relationship("Item", back_populates="admin")


class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(String)
    select_items = relationship("Item", back_populates="user")
    

class Item(Base):
    __tablename__ = "Items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    type = Column(String)
    quantity = Column(Float)
    unit = Column(String)
    freshness_level = Column(String)
    pickup_location = Column(String)
    expiry_time = Column(String)
    timestamp = Column(String)
    special_instruction = Column(String)
    select = Column(Boolean)
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    user_id = Column(Integer, ForeignKey("Users.id"))
    admin = relationship("Admin", back_populates="items_added")
    user = relationship("User", back_populates="select_items")
    