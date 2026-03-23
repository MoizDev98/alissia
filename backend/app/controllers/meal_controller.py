from datetime import date
from config.db import supabase
from models.meal_model import MealLogUpsert


def upsert_meal_log(payload: MealLogUpsert):
    try:
        data = payload.model_dump()
        meal_date = data.get("meal_date") or date.today().isoformat()

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
        query_date = meal_date or date.today().isoformat()
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