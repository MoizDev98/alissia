from config.db import supabase
from models.user_model import UserCreate

#llamamos a la tabla de usuarios y seleccionamos todos los datos
def get_all_users():
    response = supabase.table("users").select("*").execute()
    return response.data

#creamos un nuevo usuario a partir de los datos recibidos en el cuerpo de la solicitud
def create_user(user: UserCreate):
    try:
        user_data = user.dict()
        
        response = supabase.table("users").insert(user_data).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
    

#eliminamos un usuario a partir de su id
def delete_user(user_id: int):
    try:
        response = supabase.table("users").upda().eq("id", user_id).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
    
 #actualizamos un usuario a partir de su id y los datos recibidos en el cuerpo de la solicitud   
def update_user(user_id: int, user: UserCreate):
  try:  
    datos_limpios = user.dict(exclude_unset=True)
    response = supabase.table("users").update(datos_limpios).eq("id", user_id).execute()
    return response.data
  except Exception as e:
    return {"error": str(e)}

#desactivamos un usuario a partir de su id, cambiando su estado a "INACTIVE"
def soft_delete_user(user_id: int):
    try:
        payload = {"status": "INACTIVE"}
        response = supabase.table("users").update(payload).eq("id", user_id).execute()
        return {"message": f"Usuario {user_id} desactivado correctamente"}
    except Exception as e:
        return {"error": str(e)}