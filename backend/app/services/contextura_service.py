import cv2
import logging
import os
import numpy as np
from pathlib import Path
from ultralytics import YOLO
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

logger = logging.getLogger(__name__)

_model = None
_MODEL_NAME = os.getenv("YOLO_MODEL", "yolo26n.pt")
_FALLBACK_MODEL = "yolov8n.pt"

# Umbrales de calidad
_MIN_CONFIDENCE = 0.60
_MIN_WIDTH = 300
_MIN_HEIGHT = 300
_MIN_FRAME_COVERAGE = 0.12   # persona debe ocupar al menos 12% del área total
_BORDER_MARGIN = 0.04        # margen de borde para detectar extremidades cortadas
_LOOSE_CLOTHING_RATIO = 0.47 # ratio alto puede indicar ropa holgada


def _get_model() -> YOLO:
    global _model
    if _model is None:
        try:
            _model = YOLO(_MODEL_NAME)
            logger.info("Modelo YOLO cargado: %s", _MODEL_NAME)
        except Exception as exc:
            logger.warning(
                "No se pudo cargar %s (%s). Usando fallback: %s",
                _MODEL_NAME, exc, _FALLBACK_MODEL
            )
            _model = YOLO(_FALLBACK_MODEL)
    return _model


def _clasificar_contextura(ratio: float) -> str:
    if ratio < 0.28:
        return "Delgada"
    if ratio <= 0.45:
        return "Media"
    return "Robusta"


def estimar_contextura_desde_imagen(file_bytes: bytes) -> dict:
    if not file_bytes:
        raise ValueError("El archivo esta vacio")

    np_image = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("No se pudo leer la imagen")

    img_h, img_w = image.shape[:2]
    if img_w < _MIN_WIDTH or img_h < _MIN_HEIGHT:
        raise ValueError(
            f"Imagen demasiado pequeña ({img_w}x{img_h} px). "
            f"Mínimo requerido: {_MIN_WIDTH}x{_MIN_HEIGHT} px."
        )

    model = _get_model()
    results = model.predict(source=image, conf=0.25, verbose=False)

    if not results or results[0].boxes is None:
        return {"persona_detectada": False, "mensaje": "No se detecto una persona en la imagen."}

    # Filtrar solo personas con confianza suficiente
    person_boxes = []
    for box in results[0].boxes:
        if int(box.cls[0].item()) != 0:
            continue
        conf = float(box.conf[0].item())
        if conf < _MIN_CONFIDENCE:
            continue
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        person_boxes.append((x1, y1, x2, y2, conf))

    if len(person_boxes) == 0:
        return {
            "persona_detectada": False,
            "mensaje": "No se detecto una persona con confianza suficiente. Asegúrate de estar bien iluminado y centrado en la imagen."
        }

    if len(person_boxes) > 1:
        return {
            "persona_detectada": False,
            "multiple_personas": True,
            "mensaje": f"Se detectaron {len(person_boxes)} personas en la imagen. Por favor sube una foto con una sola persona visible."
        }

    x1, y1, x2, y2, conf = person_boxes[0]

    # Análisis de encuadre
    img_area = float(img_w * img_h)
    person_area = max(1.0, (x2 - x1)) * max(1.0, (y2 - y1))
    coverage = person_area / img_area

    warnings = []

    if coverage < _MIN_FRAME_COVERAGE:
        warnings.append(
            "La persona ocupa muy poco espacio en la imagen. "
            "Para mayor precisión, acércate más a la cámara."
        )

    # Detectar extremidades cortadas por el borde
    bx = img_w * _BORDER_MARGIN
    by = img_h * _BORDER_MARGIN
    if x1 < bx or x2 > img_w - bx or y1 < by or y2 > img_h - by:
        warnings.append(
            "Parte del cuerpo podría estar fuera del encuadre. "
            "Para mayor precisión, asegúrate de que la persona esté completamente visible."
        )

    ancho = max(1.0, x2 - x1)
    alto = max(1.0, y2 - y1)
    ratio = round(ancho / alto, 4)

    # Heurística de ropa holgada (solo advertencia, no bloqueo)
    if ratio > _LOOSE_CLOTHING_RATIO:
        warnings.append(
            "El resultado puede verse afectado si la persona usa ropa muy holgada."
        )

    return {
        "persona_detectada": True,
        "contextura": _clasificar_contextura(ratio),
        "ratio": ratio,
        "confianza": round(conf, 3),
        "cobertura_frame": round(coverage, 3),
        "bounding_box": {
            "x1": int(round(x1)),
            "y1": int(round(y1)),
            "x2": int(round(x2)),
            "y2": int(round(y2))
        },
        "warnings": warnings,
        "modelo_usado": _MODEL_NAME
    }
