from config.db import supabase
from controllers.ia_controller import generar_dieta
from controllers.profile_controller import get_active_profile
from controllers.weight_controller import get_latest_weight
from controllers.objective_controller import get_active_objective


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


def _build_objective_text(active_objective: dict | None, profile_goal: str | None) -> str:
    if not active_objective:
        return str(profile_goal or "")

    goal_type = str(active_objective.get("goal_type") or "").strip().lower()
    pace = str(active_objective.get("pace") or "moderado").strip().lower()
    target_weight = active_objective.get("target_weight")
    notes = str(active_objective.get("notes") or "").strip()

    text = f"Quiero {goal_type} de peso. Ritmo: {pace}."
    if target_weight is not None:
        text += f" Peso meta: {target_weight} kg."
    if notes:
        text += f" Preferencias: {notes}"
    return text


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

        active_objective = get_active_objective(user_id)
        if isinstance(active_objective, dict) and "error" in active_objective:
            return active_objective

        snapshot = _build_snapshot(user_id, profile, latest_weight)
        snapshot["objetivo"] = _build_objective_text(active_objective, profile.get("goal"))

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