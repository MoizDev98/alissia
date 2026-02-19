from fastapi import APIRouter, HTTPException
from controllers.plan_controller import save_diet_plan, get_user_plans
from models.plan_model import PlanCreate

plan_router = APIRouter()

@plan_router.post("/plans")
def create_plan(plan: PlanCreate):
    result = save_diet_plan(plan)
    if "error" in result:
         raise HTTPException(status_code=400, detail=result["error"])
    return result

@plan_router.get("/plans/{user_id}")
def read_user_plans(user_id: int):
    return get_user_plans(user_id)