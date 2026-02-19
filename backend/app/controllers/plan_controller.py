from config.db import supabase
from models.plan_model import PlanCreate

def save_diet_plan(plan: PlanCreate):
    try:
        data = plan.dict()
        
        response = supabase.table("nutritional_plans").insert(data).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
    

def get_user_plans(user_id: int):
    
    try:
        response = supabase.table("nutritional_plans")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}