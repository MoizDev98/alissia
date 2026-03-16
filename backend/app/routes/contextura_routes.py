from fastapi import APIRouter, File, HTTPException, UploadFile

from services.contextura_service import estimar_contextura_desde_imagen


contextura_router = APIRouter()


@contextura_router.post("/contextura")
async def analizar_contextura(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Debes subir un archivo de imagen valido")

    file_bytes = await file.read()

    try:
        result = estimar_contextura_desde_imagen(file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {exc}") from exc

    if result.get("multiple_personas"):
        raise HTTPException(status_code=422, detail=result.get("mensaje"))

    if not result.get("persona_detectada"):
        raise HTTPException(status_code=404, detail=result.get("mensaje", "No se detecto una persona"))

    return result
