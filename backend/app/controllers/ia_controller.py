from models.ia_model import DietaRequest
from services.ai_service import generar_dieta_ia


GENEROS_VALIDOS = {"femenino", "masculino", "otro", "no especificado"}


def _pipe_preprocesar(datos_usuario: DietaRequest) -> dict:
    # Pipe: se aplica en controller antes de llamar al servicio de IA.
    payload = datos_usuario.model_dump()
    payload["peso"] = round(float(payload["peso"]), 2)
    payload["altura"] = round(float(payload["altura"]), 2)
    payload["edad"] = int(payload["edad"])
    payload["objetivo"] = " ".join(str(payload.get("objetivo") or "").strip().split())
    payload["genero"] = str(payload.get("genero") or "no especificado").strip().lower()
    return payload


def _validaciones_propias(payload: dict) -> None:
    # Validación propia: lógica de negocio manual (sin librerías externas).
    if payload["peso"] < 30 or payload["peso"] > 350:
        raise ValueError("El peso debe estar entre 30 y 350 kg")

    if payload["altura"] < 120 or payload["altura"] > 230:
        raise ValueError("La altura debe estar entre 120 y 230 cm")

    if payload["edad"] < 12 or payload["edad"] > 100:
        raise ValueError("La edad debe estar entre 12 y 100 años")

    if payload["genero"] not in GENEROS_VALIDOS:
        raise ValueError("Género inválido. Usa: femenino, masculino, otro o no especificado")

    if len(payload["objetivo"]) < 3 or len(payload["objetivo"]) > 250:
        raise ValueError("El objetivo debe tener entre 3 y 250 caracteres")


def generar_dieta(datos_usuario: DietaRequest | dict):
    try:
        # Compatibilidad: acepta interfaz tipada y también dict legado.
        request = datos_usuario if isinstance(datos_usuario, DietaRequest) else DietaRequest(**datos_usuario)

        payload = _pipe_preprocesar(request)
        _validaciones_propias(payload)

        respuesta = generar_dieta_ia(payload)
        return respuesta
    except Exception as e:
        return {"error": str(e)}