from fastapi import APIRouter, HTTPException
from controllers.ia_controller import generar_dieta

ia_router = APIRouter()

@ia_router.post("/dieta")
def crear_dieta(datos: dict):
    result = generar_dieta(datos)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])
    return result

@ia_router.post("/generar-dieta")
def crear_dieta_legacy(datos: dict):
    result = generar_dieta(datos)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])
    return result