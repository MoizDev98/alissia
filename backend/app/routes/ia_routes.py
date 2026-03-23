from fastapi import APIRouter, HTTPException
from controllers.ia_controller import generar_dieta
from models.ia_model import DietaRequest, DietaResponse

ia_router = APIRouter()

@ia_router.post("/dieta")
def crear_dieta(datos: DietaRequest):
    # Interface aplicada en route: FastAPI valida el request con Pydantic.
    result = generar_dieta(datos)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])
    return DietaResponse(**result)

@ia_router.post("/generar-dieta")
def crear_dieta_legacy(datos: DietaRequest):
    # Route legacy: misma validación/interfaz para no romper clientes antiguos.
    result = generar_dieta(datos)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])
    return DietaResponse(**result)