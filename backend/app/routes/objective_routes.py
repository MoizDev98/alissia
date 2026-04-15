from fastapi import APIRouter, HTTPException
from controllers.objective_controller import upsert_active_objective, get_active_objective
from models.objective_model import ObjectiveUpsert


objective_router = APIRouter()


@objective_router.post("/objectives")
def save_objective(payload: ObjectiveUpsert):
    result = upsert_active_objective(payload)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@objective_router.get("/objectives/{user_id}/active")
def read_active_objective(user_id: int):
    result = get_active_objective(user_id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    if not result:
        raise HTTPException(status_code=404, detail="Objetivo activo no encontrado")
    return result