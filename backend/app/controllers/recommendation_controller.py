from config.db import supabase
from controllers.ia_controller import generar_dieta
from controllers.profile_controller import get_active_profile
from controllers.weight_controller import get_latest_weight


def _build_snapshot(user_id: int, profile: dict, latest_weight: dict | None) -> dict:
    # Pipe backend: arma el payload final para IA con último peso disponible.
    weight_value = latest_weight["weight"] if latest_weight else profile.get("weight")

    return {
        "user_id": user_id,
        "peso": float(weight_value),
        "altura": float(profile.get("height")),
        "edad": int(profile.get("age")),
        "genero": str(profile.get("gender")),
        "objetivo": str(profile.get("goal")),
    }


def generate_recommendation_for_user(user_id: int):
    try:
        profile = get_active_profile(user_id)
        if not profile:
            return {"error": "El usuario no tiene perfil activo. Primero debe completar su objetivo."}

        if isinstance(profile, dict) and "error" in profile:
            return profile

        latest_weight = get_latest_weight(user_id)
        if isinstance(latest_weight, dict) and "error" in latest_weight:
            return latest_weight

        snapshot = _build_snapshot(user_id, profile, latest_weight)

        dieta = generar_dieta(snapshot)
        if isinstance(dieta, dict) and "error" in dieta:
            return dieta

        # Guarda plan generado para reutilización del módulo de planes.
        plan_result = (
            supabase.table("nutritional_plans")
            .insert({
                "user_id": user_id,
                "plan_data": dieta,
                "status": "ACTIVE",
            })
            .execute()
        )
        plan_id = plan_result.data[0]["id"] if plan_result.data else None

        # Guarda historial completo para trazabilidad.
        history_result = (
            supabase.table("recommendation_history")
            .insert({
                "user_id": user_id,
                "plan_id": plan_id,
                "profile_snapshot": snapshot,
                "ai_response": dieta,
                "model_name": "colab-generate",
                "status": "ACTIVE",
            })
            .execute()
        )

        history_id = history_result.data[0]["id"] if history_result.data else None

        return {
            "user_id": user_id,
            "profile_snapshot": snapshot,
            "dieta": dieta,
            "history_id": history_id,
        }
    except Exception as e:
        return {"error": str(e)}


def get_recommendation_history(user_id: int, limit: int = 20):
    try:
        response = (
            supabase.table("recommendation_history")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "ACTIVE")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"error": str(e)}