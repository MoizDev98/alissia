from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    id: Optional[int] = None
    role_id: int
    document_type_id: int
    document_number: str
    first_name: str
    last_name: str
    gender: str
    phone: str
    password: str
    email: str

class UserResponse(UserCreate):
    id: int
    status: str

class UserUpdate(BaseModel):
    role_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    document_type_id: Optional[int] = None
    document_number: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None


class LoginAzureRequest(BaseModel):
    email: EmailStr


class PublicRegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    age: int
    phone: str
    document_type_id: int
    document_number: str
    gender: str
    password: str
    confirm_password: str
    accept_terms: bool


class PublicRegisterResponse(BaseModel):
    message: str
    user_id: int

