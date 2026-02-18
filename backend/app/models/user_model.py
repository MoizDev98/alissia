from pydantic import BaseModel
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
    
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    document_type_id: Optional[int] = None
    document_number: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None