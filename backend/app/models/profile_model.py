from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProfileCreate(BaseModel):
    user_id: int
    weight: float
    height: float
    age: int
    gender: str
    activity_level: str
    goal: str


class ProfileUpdate(BaseModel):
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    status: Optional[str] = None