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
    contact = Column(String)
    profile_pic_url = Column(String, default="")
    items_added = relationship("Item", back_populates="admin")
    selected_items = relationship("SelectedItem", back_populates="admin")
    collected_items = relationship("CollectedItem", back_populates="admin")
    expired_items = relationship("ExpiredItem", back_populates="admin")
    daily_data = relationship("DailyData", back_populates="admin")
    monthly_data = relationship("MonthlyData", back_populates="admin")
    notification = relationship("AdminNotification", back_populates="admin")
    upcoming_events = relationship("AdminUpcomingEvent", back_populates="admin")


class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    role = Column(String)
    contact = Column(String)
    profile_pic_url = Column(String, default="")
    selected_items = relationship("SelectedItem", back_populates="user")
    collected_items = relationship("CollectedItem", back_populates="user")
    daily_data = relationship("UserDailyData", back_populates="user")
    monthly_data = relationship("UserMonthlyData", back_populates="user")
    current_data = relationship("UserCurrentData", back_populates="user")
    notification = relationship("UserNotification", back_populates="user")


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
    provided_quantity = Column(Float)
    image_url = Column(String, default="")
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="items_added")
    # user = relationship("User", back_populates="select_items")

class SelectedItem(Base):
    __tablename__ = "SelectedItems"
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
    image_url = Column(String, default="")
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="selected_items")
    selection_time = Column(String)
    previous_state_id = Column(Integer)
    percentage_quantity = Column(Float)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="selected_items")

class CollectedItem(Base):
    __tablename__ = "CollectedItems"
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
    image_url = Column(String, default="")
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="collected_items")
    collection_time = Column(String)
    previous_state_id = Column(Integer)
    percentage_quantity = Column(Float)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="collected_items")

class ExpiredItem(Base):
    __tablename__ = "ExpiredItems"
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
    image_url = Column(String, default="")
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="expired_items")



class DailyData(Base):
    __tablename__ = "DailyDatas"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    total_donations = Column(Integer)
    partial_donation = Column(Integer)
    items_provided = Column(Integer)
    impact_score = Column(Integer)
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="daily_data")

class UserDailyData(Base):
    __tablename__ = "UserDailyDatas"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    items_received = Column(Integer)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="daily_data")

class UserCurrentData(Base):
    __tablename__ = "UserCurrentDatas"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    active_requests = Column(Integer)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="current_data")

class MonthlyData(Base):
    __tablename__ = "MonthlyDatas"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    total_donations = Column(Integer, default=0)
    partial_donation = Column(Integer, default=0)
    items_provided = Column(Integer, default=0)
    impact_score = Column(Integer)
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="monthly_data")

class UserMonthlyData(Base):
    __tablename__ = "UserMonthlyDatas"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    items_received = Column(Integer)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="monthly_data")

class OtpData(Base):
    __tablename__ = "OtpData"
    id = Column(Integer, primary_key=True, index=True)
    otp = Column(String)
    timestamp = Column(String)

class AdminNotification(Base):
    __tablename__ = "AdminNotifications"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    seen = Column(Boolean, default=False)
    timestamp = Column(String)
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="notification")

class UserNotification(Base):
    __tablename__ = "UserNotifications"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    seen = Column(Boolean, default=False)
    timestamp = Column(String)
    user_id = Column(Integer, ForeignKey("Users.id"))
    user = relationship("User", back_populates="notification")

class AdminUpcomingEvent(Base):
    __tablename__ = "AdminUpcomingEvents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, default="")
    location = Column(String, default="")
    timestamp = Column(String)
    event_date = Column(String)
    admin_id = Column(Integer, ForeignKey("Admins.id"))
    admin = relationship("Admin", back_populates="upcoming_events")
