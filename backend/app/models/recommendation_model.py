from pydantic import BaseModel
from typing import Any, Optional


class RecommendationAutoResponse(BaseModel):
    # Interface: respuesta de generación automática usando perfil + último peso.
    user_id: int
    profile_snapshot: dict[str, Any]
    dieta: dict[str, Any]
    history_id: Optional[int] = None


class RecommendationHistoryItem(BaseModel):
    id: int
    user_id: int
    plan_id: Optional[int] = None
    profile_snapshot: dict[str, Any]
    ai_response: dict[str, Any]
    model_name: Optional[str] = None
    created_at: str
    status: str