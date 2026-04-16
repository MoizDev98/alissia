from datetime import datetime
from zoneinfo import ZoneInfo
import os
from config.db import supabase
from models.meal_model import MealLogUpsert


APP_TIMEZONE = os.getenv("APP_TIMEZONE", "America/Bogota")


def _resolver_fecha_local(meal_date: str | None) -> str:
    if meal_date:
      try:
          return datetime.fromisoformat(meal_date).date().isoformat()
      except Exception:
          pass

    try:
        return datetime.now(ZoneInfo(APP_TIMEZONE)).date().isoformat()
    except Exception:
        return datetime.now().date().isoformat()


def upsert_meal_log(payload: MealLogUpsert):
    try:
        data = payload.model_dump()
        meal_date = _resolver_fecha_local(data.get("meal_date"))

        existing = (
            supabase.table("meal_logs")
            .select("id")
            .eq("user_id", data["user_id"])
            .eq("meal_date", meal_date)
            .eq("meal_type", data["meal_type"])
            .limit(1)
            .execute()
        )

        base_payload = {
            "user_id": data["user_id"],
            "meal_date": meal_date,
            "meal_type": data["meal_type"],
            "status": data["status"],
            "planned_text": data.get("planned_text"),
            "consumed_text": data.get("consumed_text"),
            "estimated_calories": data.get("estimated_calories"),
            "plan_id": data.get("plan_id"),
        }

        if existing.data:
            log_id = existing.data[0]["id"]
            response = (
                supabase.table("meal_logs")
                .update(base_payload)
                .eq("id", log_id)
                .execute()
            )
        else:
            response = supabase.table("meal_logs").insert(base_payload).execute()

        return response.data[0] if response.data else None
    except Exception as e:
        return {"error": str(e)}


def get_daily_meal_logs(user_id: int, meal_date: str | None = None):
    try:
        query_date = _resolver_fecha_local(meal_date)
        response = (
            supabase.table("meal_logs")
            .select("*")
            .eq("user_id", user_id)
            .eq("meal_date", query_date)
            .order("created_at", desc=False)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"error": str(e)}