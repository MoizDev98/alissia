from pydantic import BaseModel
from typing import Optional


class ObjectiveUpsert(BaseModel):
    user_id: int
    goal_type: str
    target_weight: Optional[float] = None
    pace: Optional[str] = "moderado"
    notes: Optional[str] = None


class ObjectiveResponse(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_weight: Optional[float] = None
    pace: str
    notes: Optional[str] = None
    is_active: bool