from fastapi import APIRouter, HTTPException, Query
from controllers.weight_controller import create_weight_log, get_latest_weight, get_weight_history
from models.weight_model import WeightLogCreate


weight_router = APIRouter()


@weight_router.post("/weights")
def register_weight(payload: WeightLogCreate):
    result = create_weight_log(payload)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@weight_router.get("/weights/{user_id}/latest")
def read_latest_weight(user_id: int):
    result = get_latest_weight(user_id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    if not result:
        raise HTTPException(status_code=404, detail="No hay registros de peso para este usuario")
    return result


@weight_router.get("/weights/{user_id}")
def read_weight_history(user_id: int, limit: int = Query(default=30, ge=1, le=200)):
    result = get_weight_history(user_id, limit)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result