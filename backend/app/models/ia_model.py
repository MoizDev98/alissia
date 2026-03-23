from pydantic import BaseModel, Field


class DietaRequest(BaseModel):
    # Interface: contrato de entrada del endpoint /dieta
    peso: float = Field(..., description="Peso en kilogramos")
    altura: float = Field(..., description="Altura en centímetros")
    edad: int = Field(..., description="Edad en años")
    objetivo: str = Field(..., description="Objetivo nutricional del usuario")
    genero: str = Field(default="no especificado", description="Género reportado")


class DietaResponse(BaseModel):
    # Interface: contrato de salida esperado para la dieta diaria
    desayuno: str
    almuerzo: str
    cena: str
    calorias_totales: int
    recomendacion_clave: str