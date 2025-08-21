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