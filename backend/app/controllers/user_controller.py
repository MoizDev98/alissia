from config.db import supabase
from config.db import supabase
from models.user_schemas import UserCreate, UserUpdate, PublicRegisterRequest
from core.security import crear_token_jwt


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


def register_public_user(payload: PublicRegisterRequest):
    """
    Registro publico para usuarios de la app (sin token).
    Mantiene validaciones de negocio antes de insertar en users.
    """
    try:
        if not payload.accept_terms:
            return {"error": "Debes aceptar los terminos y condiciones."}

        if payload.password != payload.confirm_password:
            return {"error": "La contrasena y su confirmacion no coinciden."}

        if payload.age < 5 or payload.age > 120:
            return {"error": "La edad debe estar entre 5 y 120 anos."}

        if len(payload.password) < 8:
            return {"error": "La contrasena debe tener al menos 8 caracteres."}

        existing_email = supabase.table("users").select("id").eq("email", payload.email).limit(1).execute()
        if existing_email.data and len(existing_email.data) > 0:
            return {"error": "El correo ya esta registrado."}

        existing_document = supabase.table("users").select("id").eq("document_number", payload.document_number).limit(1).execute()
        if existing_document.data and len(existing_document.data) > 0:
            return {"error": "El numero de documento ya esta registrado."}

        document_type = supabase.table("document_types").select("id").eq("id", payload.document_type_id).limit(1).execute()
        if not document_type.data or len(document_type.data) == 0:
            return {"error": "El tipo de documento seleccionado no es valido."}

        new_user = {
            "role_id": 3,
            "document_type_id": payload.document_type_id,
            "document_number": payload.document_number.strip(),
            "first_name": payload.first_name.strip(),
            "last_name": payload.last_name.strip(),
            "gender": payload.gender.strip().lower(),
            "phone": payload.phone.strip(),
            "password": payload.password,
            "email": str(payload.email).strip().lower(),
            "status": "ACTIVE",
        }

        insert_response = supabase.table("users").insert(new_user).execute()

        if not insert_response.data or len(insert_response.data) == 0:
            return {"error": "No se pudo crear la cuenta."}

        created_user = insert_response.data[0]
        return {
            "message": "Cuenta creada correctamente.",
            "user_id": created_user.get("id"),
        }
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

        usuario = response.data[0]
        token = crear_token_jwt(usuario)
        usuario["token"] = token
        return usuario

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