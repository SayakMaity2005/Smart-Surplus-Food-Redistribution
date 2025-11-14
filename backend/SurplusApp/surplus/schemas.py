from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class Register(BaseModel):
    name: str
    username: str
    password: str
    role: str
    contact: str

class RegisterForm(Register):
    confirmPassword: str

class LoginForm(BaseModel):
    username: str
    password: str

class VerifiedUser(BaseModel):
    name: str
    username: str
    role: str

class AddItemForm(BaseModel):
    title: str
    type: str
    quantity: float
    unit: str
    freshness_level: str
    pickup_location: str
    expiry_time: str
    timestamp: str
    special_instruction: str
    image_url: str

class EditItemForm(AddItemForm):
    id: int
class CheckEdit(BaseModel):
    id: int

class ItemUser:
    title: str
    type: str
    quantity: float
    unit: str
    freshness_level: str
    pickup_location: str
    expiry_time: str
    timestamp: str
    special_instruction: str
    image_url: str
    admin_id: int
    admin_name: str = ""
    admin_username = ""
    admin_contact: str
class ItemAdmin:
    title: str
    type: str
    quantity: float
    unit: str
    freshness_level: str
    pickup_location: str
    expiry_time: str
    timestamp: str
    special_instruction: str
    image_url: str
    user_id: int
    user_name: str = ""
    user_username = ""
    user_contact: str

class ItemId(BaseModel):
    item_id: int

class GetAllItems(AddItemForm):
    id: int

class RequestEvent(BaseModel):
    title: str
    description: str = ""
    location: str = ""
    event_date: str