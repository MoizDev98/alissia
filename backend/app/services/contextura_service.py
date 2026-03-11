import cv2
import numpy as np
from ultralytics import YOLO


_model = None


def _get_model() -> YOLO:
    global _model
    if _model is None:
        _model = YOLO("yolov8n.pt")
    return _model


def _clasificar_contextura(ratio: float) -> str:
    if ratio < 0.35:
        return "Delgada"
    if ratio <= 0.50:
        return "Media"
    return "Robusta"


def estimar_contextura_desde_imagen(file_bytes: bytes) -> dict:
    if not file_bytes:
        raise ValueError("El archivo esta vacio")

    np_image = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("No se pudo leer la imagen")

    model = _get_model()
    results = model.predict(source=image, conf=0.25, verbose=False)
    if not results:
        return {"persona_detectada": False, "mensaje": "No se detecto una persona en la imagen."}

    boxes = results[0].boxes
    if boxes is None or len(boxes) == 0:
        return {"persona_detectada": False, "mensaje": "No se detecto una persona en la imagen."}

    best_candidate = None
    best_score = -1.0

    for box in boxes:
        cls_id = int(box.cls[0].item())
        if cls_id != 0:
            continue

        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0].item())
        area = max(0.0, (x2 - x1)) * max(0.0, (y2 - y1))
        score = conf * area

        if score > best_score:
            best_score = score
            best_candidate = (x1, y1, x2, y2)

    if best_candidate is None:
        return {"persona_detectada": False, "mensaje": "No se detecto una persona en la imagen."}

    x1, y1, x2, y2 = best_candidate
    ancho = max(1.0, x2 - x1)
    alto = max(1.0, y2 - y1)
    ratio = round(ancho / alto, 4)

    return {
        "persona_detectada": True,
        "contextura": _clasificar_contextura(ratio),
        "ratio": ratio,
        "bounding_box": {
            "x1": int(round(x1)),
            "y1": int(round(y1)),
            "x2": int(round(x2)),
            "y2": int(round(y2))
        }
    }
