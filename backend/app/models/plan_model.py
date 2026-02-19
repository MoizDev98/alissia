from pydantic import BaseModel
from typing import Dict, Any

class PlanCreate(BaseModel):
    user_id: int
    plan_data: Dict[str, Any] 