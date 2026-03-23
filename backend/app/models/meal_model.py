from pydantic import BaseModel, Field
from typing import Optional


class MealLogUpsert(BaseModel):
    # Interface: registro diario de cumplimiento de comida por usuario.
    user_id: int
    meal_type: str = Field(..., pattern="^(desayuno|almuerzo|cena|snack)$")
    status: str = Field(..., pattern="^(planned|completed|skipped)$")
    planned_text: Optional[str] = None
    consumed_text: Optional[str] = None
    estimated_calories: Optional[int] = None
    plan_id: Optional[int] = None
    meal_date: Optional[str] = None


class MealLogItem(BaseModel):
    id: int
    user_id: int
    plan_id: Optional[int] = None
    meal_date: str
    meal_type: str
    planned_text: Optional[str] = None
    consumed_text: Optional[str] = None
    status: str
    estimated_calories: Optional[int] = None
    created_at: str
    updated_at: str