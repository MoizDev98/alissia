from config.db import supabase
from models.profile_model import ProfileCreate, ProfileUpdate
from datetime import datetime

# 1. Crear o Actualizar Perfil
def upsert_profile(profile: ProfileCreate):
    try:
        data = profile.dict()
        response = supabase.table("patient_profiles").insert(data).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}

# 2. Obtener el perfil ACTIVO de un usuario
def get_active_profile(user_id: int):
    try:
        response = supabase.table("patient_profiles")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("status", "ACTIVE")\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
            
        if len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        return {"error": str(e)}

# 3. Soft Delete (Cambiar estado a INACTIVE)
def soft_delete_profile(profile_id: int):
    try:
        response = supabase.table("patient_profiles")\
            .update({"status": "INACTIVE", "updated_at": datetime.now().isoformat()})\
            .eq("id", profile_id)\
            .execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}