import os
from groq import Groq  
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("IA_API_KEY")

client = Groq(api_key=api_key)

def generar_dieta_inteligente(peso, altura, objetivo, genero, edad):
    prompt_sistema = "Eres un nutricionista experto llamado Kamoca. Respondes SIEMPRE en formato JSON válido, sin texto extra antes ni después."
    
    prompt_usuario = f"""
    Crea un plan nutricional de 1 día para este paciente:
    - Peso: {peso}kg
    - Altura: {altura}cm
    - Edad: {edad} años
    - Género: {genero}
    - Objetivo: {objetivo}

    Estructura tu respuesta ESTRICTAMENTE así (JSON):
    {{
        "desayuno": "nombre del plato y breve descripción",
        "almuerzo": "nombre del plato y breve descripción",
        "cena": "nombre del plato y breve descripción",
        "calorias_totales": 000,
        "recomendacion_clave": "una frase corta de consejo"
    }}
    """
    try:
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": prompt_usuario}
            ],
            model="llama-3.3-70b-versatile", 
            temperature=0.5, 
            response_format={"type": "json_object"} 
        )

        
        respuesta_json = chat_completion.choices[0].message.content
        return respuesta_json

    except Exception as e:
        return str(e)