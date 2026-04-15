from pydantic import BaseModel
from typing import Any, Optional
from datetime import datetime


class ProfileCreate(BaseModel):
    user_id: int
    weight: float
    height: float
    age: int
    gender: str
    activity_level: str
    goal: str
    contextura: Optional[str] = None
    body_analysis: Optional[dict[str, Any]] = None
    analysis_updated_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    contextura: Optional[str] = None
    body_analysis: Optional[dict[str, Any]] = None
    analysis_updated_at: Optional[datetime] = None
    status: Optional[str] = None