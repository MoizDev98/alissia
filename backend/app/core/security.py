import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, SecurityScopes
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer


load_dotenv()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave-secreta-temporal-cambiar-en-produccion")
JWT_EXPIRATION_HOURS = 1


def crear_token_jwt(datos_usuario: dict) -> str:
    payload = {
        "sub": str(datos_usuario["id"]),
        "email": datos_usuario["email"],
        "role_id": datos_usuario.get("role_id"),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
    return token


def verificar_token_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Tu sesión ha expirado.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido.")


azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id="7e7f855d-7451-4b60-b2bc-ef3f84b8ad0a",
    tenant_id="1e9aabe8-67f8-4f1c-a329-a754e92499ae",
    scopes={} 
)

token_auth_scheme = HTTPBearer()


async def obtener_usuario_actual(
    request: Request,
    token_bruto: HTTPAuthorizationCredentials = Depends(token_auth_scheme)
):


    try:
        usuario_azure = await azure_scheme(request, SecurityScopes())
        return {"origen": "azure", "datos": usuario_azure}
    except Exception as e:
        print(f"El guardia de Azure rechazó el token. Motivo: {str(e)}")


    try:
        token_str = token_bruto.credentials
        datos_usuario = verificar_token_jwt(token_str)
        return {"origen": "jwt_propio", "datos": datos_usuario}
    except HTTPException:
        raise
    except Exception as e:
        print(f"El guardia de JWT rechazó el token. Motivo: {str(e)}")

    raise HTTPException(
        status_code=401,
        detail="No autorizado. El token no es válido para Azure ni para nuestro sistema."
    )