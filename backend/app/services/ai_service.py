import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

AI_URL = (os.getenv("AI_URL") or "").rstrip("/")


def _build_prompt(datos: dict) -> str:
    peso = datos.get("peso")
    altura = datos.get("altura")
    edad = datos.get("edad")
    objetivo = datos.get("objetivo")
    genero = datos.get("genero")

    return f"""
Eres un nutricionista profesional.

Genera un plan de alimentación de 1 día personalizado.

Responde ÚNICAMENTE en JSON válido.
No agregues texto fuera del JSON.
No agregues explicaciones.
No uses placeholders como "alimento", "comida", "..." o "texto real".

El JSON debe tener EXACTAMENTE esta estructura:
{{
  "desayuno": "plato real y breve descripción",
  "almuerzo": "plato real y breve descripción",
  "cena": "plato real y breve descripción",
  "calorias_totales": 1800,
  "recomendacion_clave": "recomendación breve y útil"
}}

Datos del usuario:
- Peso: {peso} kg
- Altura: {altura} cm
- Edad: {edad}
- Género: {genero}
- Objetivo: {objetivo}
"""


def _es_placeholder(valor: str) -> bool:
    normalizado = (valor or "").strip().lower()
    return (
        "alimento" in normalizado
        or "comida" in normalizado
        or "texto real" in normalizado
        or "plato real" in normalizado
        or "breve descripción" in normalizado
        or "breve descripcion" in normalizado
        or "recomendación breve" in normalizado
        or "recomendacion breve" in normalizado
        or normalizado in {"...", "no disponible", ""}
    )


def _dieta_valida(dieta: dict | None) -> bool:
    if not isinstance(dieta, dict):
        return False

    campos = [
        str(dieta.get("desayuno", "")),
        str(dieta.get("almuerzo", "")),
        str(dieta.get("cena", "")),
        str(dieta.get("recomendacion_clave", ""))
    ]

    return all(not _es_placeholder(campo) for campo in campos)


def _extract_json(texto: str) -> dict | None:
    try:
        return json.loads(texto)
    except Exception:
        pass

    candidatos = []
    inicio = None
    profundidad = 0

    for idx, char in enumerate(texto):
        if char == "{":
            if profundidad == 0:
                inicio = idx
            profundidad += 1
        elif char == "}" and profundidad > 0:
            profundidad -= 1
            if profundidad == 0 and inicio is not None:
                candidatos.append(texto[inicio: idx + 1])

    for candidato in reversed(candidatos):
        try:
            parsed = json.loads(candidato)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            continue

    return None


def generar_dieta_ia(datos: dict):
    if not AI_URL:
        raise ValueError("AI_URL no esta configurada en el backend")

    payload = {"text": _build_prompt(datos)}

    response = requests.post(f"{AI_URL}/generate", json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()
    texto = data.get("response", "") if isinstance(data, dict) else ""

    dieta_json = _extract_json(texto)
    if _dieta_valida(dieta_json):
        return dieta_json

    prompt_refuerzo = payload["text"] + "\n\nIMPORTANTE: Debes responder con comidas concretas, nunca placeholders."
    response_2 = requests.post(f"{AI_URL}/generate", json={"text": prompt_refuerzo}, timeout=60)
    response_2.raise_for_status()
    data_2 = response_2.json()
    texto_2 = data_2.get("response", "") if isinstance(data_2, dict) else ""
    dieta_json_2 = _extract_json(texto_2)

    if _dieta_valida(dieta_json_2):
        return dieta_json_2

    return {
        "desayuno": "No disponible",
        "almuerzo": "No disponible",
        "cena": "No disponible",
        "calorias_totales": 0,
        "recomendacion_clave": "La IA externa respondió con formato no válido o placeholders. Revisa el modelo en Colab."
    }