from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from controllers.user_controller import (
    get_all_users, 
    create_user, 
    update_user, 
    soft_delete_user,
    login_user
)
from core.security import obtener_usuario_actual


#cree el modelo aqui por que es pequeño y no amerita a hacer el controlador aparte, ademas de que es solo para el login y no se va a usar en ningun otro lugar, por lo que no tiene sentido crear un modelo aparte para esto
class LoginRequest(BaseModel):
    email: str
    password: str


from models.user_schemas import UserCreate, UserUpdate

user_router = APIRouter()


#leemos todos los usuarios disponibles en la base de datos y los devolvemos como respuesta a la solicitud GET /users
@user_router.get("/users",dependencies=[Depends(obtener_usuario_actual)])
def read_users():
    return get_all_users()


#creamos un nuevo usuario a partir de los datos recibidos en el cuerpo de la solicitud POST /users y lo guardamos en la base de datos
@user_router.post("/users",dependencies=[Depends(obtener_usuario_actual)])
def write_user(user: UserCreate):
    result = create_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


#actualizamos un usuario existente a partir de su id y los datos recibidos en el cuerpo de la solicitud PUT /users/{id}
@user_router.put("/users/{id}", dependencies=[Depends(obtener_usuario_actual)])
def update_user_endpoint(id: int, user: UserUpdate):
    result = update_user(id, user)
    
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result


#desactivamos un usuario a partir de su id, cambiando su estado a "INACTIVE" mediante la solicitud DELETE /users/{id}
@user_router.delete("/users/{id}", dependencies=[Depends(obtener_usuario_actual)])
def delete_user_endpoint(id: int):
    result = soft_delete_user(id)
    if "error" in result:
         raise HTTPException(status_code=400, detail=result["error"])
         
    return result

@user_router.post("/login")
def login_endpoint(credentials: LoginRequest):
    result = login_user(credentials.email, credentials.password)
    
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
        
    return result