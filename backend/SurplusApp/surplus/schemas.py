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

class SelectItem(BaseModel):
    item_id: int

class GetAllItems(AddItemForm):
    id: int