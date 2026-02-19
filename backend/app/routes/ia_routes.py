from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json

from controllers.ia_controller import generar_dieta_inteligente

ia_router = APIRouter()

class DatosPaciente(BaseModel):
    peso: float
    altura: float
    edad: int
    genero: str
    objetivo: str


@ia_router.post("/generar-dieta")
def endpoint_dieta(datos: DatosPaciente):
   
    respuesta_texto = generar_dieta_inteligente(
        datos.peso, 
        datos.altura, 
        datos.objetivo, 
        datos.genero,
        datos.edad
    )

    print("----- RESPUESTA CRUDA DE LA IA -----")
    print(respuesta_texto)
    print("------------------------------------")

    try:
        respuesta_limpia = json.loads(respuesta_texto)
        return respuesta_limpia
    except Exception as e:
        print("Error intentando leer el JSON:", e)
        raise HTTPException(status_code=500, detail="Error procesando la respuesta de la IA")