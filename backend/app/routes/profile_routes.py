from fastapi import APIRouter, HTTPException
from controllers.profile_controller import upsert_profile, get_active_profile, soft_delete_profile
from models.profile_model import ProfileCreate

profile_router = APIRouter()

@profile_router.post("/profiles")
def save_profile(profile: ProfileCreate):
    result = upsert_profile(profile)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@profile_router.get("/profiles/{user_id}")
def get_profile(user_id: int):
    result = get_active_profile(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return result

@profile_router.delete("/profiles/{id}")
def delete_profile(id: int):
    return soft_delete_profile(id)