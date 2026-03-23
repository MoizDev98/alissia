from fastapi import APIRouter, HTTPException, Query
from controllers.recommendation_controller import generate_recommendation_for_user, get_recommendation_history


recommendation_router = APIRouter()


@recommendation_router.post("/recommendations/auto/{user_id}")
def create_auto_recommendation(user_id: int):
    result = generate_recommendation_for_user(user_id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@recommendation_router.get("/recommendations/history/{user_id}")
def read_recommendation_history(user_id: int, limit: int = Query(default=20, ge=1, le=100)):
    result = get_recommendation_history(user_id, limit)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result