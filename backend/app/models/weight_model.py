from pydantic import BaseModel, Field
from typing import Optional


class WeightLogCreate(BaseModel):
    # Interface: payload para registrar peso manual del usuario.
    user_id: int
    weight: float = Field(..., gt=0)
    source: str = Field(default="manual")
    note: Optional[str] = None


class WeightLogResponse(BaseModel):
    id: int
    user_id: int
    weight: float
    measured_at: str
    source: str
    note: Optional[str] = None
    status: str