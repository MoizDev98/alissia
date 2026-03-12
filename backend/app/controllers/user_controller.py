from config.db import supabase
from models.user_schemas import UserCreate, UserUpdate

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
        response = supabase.table("users").delete().eq("id", user_id).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
    
 #actualizamos un usuario a partir de su id y los datos recibidos en el cuerpo de la solicitud   
def update_user(user_id: int, user: UserUpdate):
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
    


def login_user(email: str, password: str):
    try:
        
        response = supabase.table("users")\
            .select("*")\
            .eq("email", email)\
            .eq("password", password)\
            .execute()
        
        
        if len(response.data) == 0:
            return {"error": "Credenciales incorrectas"}
        
        return response.data[0]
       
    except Exception as e:
        return {"error": str(e)}



# Sincronizamos el usuario de Azure con nuestra base de datos en Supabase
def sync_azure_user(email: str, nombre_completo: str, role_id: int):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if len(response.data) > 0:
            usuario_existente = response.data[0]
            doc = usuario_existente.get("document_number")
            telefono = usuario_existente.get("phone")
            le_falta_info = not doc or doc == "PENDIENTE" or not telefono
            usuario_existente["perfil_incompleto"] = le_falta_info
            
            return usuario_existente
        
        partes_nombre = nombre_completo.split(" ", 1)
        primer_nombre = partes_nombre[0]
        apellido = partes_nombre[1] if len(partes_nombre) > 1 else "N/A"
    
        nuevo_usuario = {
            "email": email,
            "first_name": primer_nombre,
            "last_name": apellido,
            "role_id": role_id,
            "password": "SSO_AZURE_USER", 
            "document_number": "PENDIENTE", 
            "status": "ACTIVE"
        }
        
        insert_response = supabase.table("users").insert(nuevo_usuario).execute()
        
        if len(insert_response.data) > 0:
            usuario_creado = insert_response.data[0]
            usuario_creado["perfil_incompleto"] = True 
            return usuario_creado
            
        return {"error": "No se pudo sincronizar el usuario con la base de datos"}
    
    except Exception as e:
        return {"error": str(e)}



# Obtenemos los tipos de documento para el formulario de register/complete-profile
def get_document_types():
    try:
        response = supabase.table("document_types").select("*").execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}