from fastapi import APIRouter, HTTPException, Query
from controllers.meal_controller import upsert_meal_log, get_daily_meal_logs
from models.meal_model import MealLogUpsert


meal_router = APIRouter()


@meal_router.post("/meals")
def save_meal_log(payload: MealLogUpsert):
    result = upsert_meal_log(payload)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@meal_router.get("/meals/{user_id}/today")
def read_today_meals(user_id: int, meal_date: str | None = Query(default=None)):
    result = get_daily_meal_logs(user_id, meal_date)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result