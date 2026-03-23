from config.db import supabase
from models.weight_model import WeightLogCreate


def create_weight_log(payload: WeightLogCreate):
    try:
        data = payload.model_dump()
        response = supabase.table("weight_logs").insert(data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        return {"error": str(e)}


def get_latest_weight(user_id: int):
    try:
        response = (
            supabase.table("weight_logs")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "ACTIVE")
            .order("measured_at", desc=True)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        return {"error": str(e)}


def get_weight_history(user_id: int, limit: int = 30):
    try:
        response = (
            supabase.table("weight_logs")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "ACTIVE")
            .order("measured_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"error": str(e)}