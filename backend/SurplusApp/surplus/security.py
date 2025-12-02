from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    def hash_password(password: str) -> str:
        password = password[:72]  # bcrypt max length
        return pwd_context.hash(password)

    def verify_password(input_password: str, actual_hashed_password: str) -> bool:
        return pwd_context.verify(input_password, actual_hashed_password)