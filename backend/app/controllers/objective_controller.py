from config.db import supabase
from models.objective_model import ObjectiveUpsert


GOALS_VALIDOS = {"bajar", "mantener", "subir"}
RITMOS_VALIDOS = {"lento", "moderado", "rapido"}


def _validar_payload(payload: ObjectiveUpsert) -> tuple[str | None, str | None]:
    goal_type = str(payload.goal_type or "").strip().lower()
    pace = str(payload.pace or "moderado").strip().lower()

    if goal_type not in GOALS_VALIDOS:
        return None, "goal_type invalido. Usa: bajar, mantener o subir"

    if pace not in RITMOS_VALIDOS:
        return None, "pace invalido. Usa: lento, moderado o rapido"

    if payload.target_weight is not None:
        if float(payload.target_weight) < 30 or float(payload.target_weight) > 350:
            return None, "target_weight invalido. Debe estar entre 30 y 350 kg"

    return pace, None


def upsert_active_objective(payload: ObjectiveUpsert):
    try:
        pace, error = _validar_payload(payload)
        if error:
            return {"error": error}

        # Desactiva objetivos previos para dejar uno solo activo por usuario.
        supabase.table("user_objectives").update({"is_active": False}).eq("user_id", payload.user_id).eq("is_active", True).execute()

        insert_data = {
            "user_id": payload.user_id,
            "goal_type": str(payload.goal_type).strip().lower(),
            "target_weight": payload.target_weight,
            "pace": pace,
            "notes": (payload.notes or "").strip() or None,
            "is_active": True,
        }

        response = supabase.table("user_objectives").insert(insert_data).execute()
        return response.data[0] if response.data else {"error": "No se pudo guardar el objetivo"}
    except Exception as e:
        return {"error": str(e)}


def get_active_objective(user_id: int):
    try:
        response = (
            supabase.table("user_objectives")
            .select("*")
            .eq("user_id", user_id)
            .eq("is_active", True)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        return {"error": str(e)}