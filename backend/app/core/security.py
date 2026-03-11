from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer

azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id="7e7f855d-7451-4b60-b2bc-ef3f84b8ad0a",
    tenant_id="1e9aabe8-67f8-4f1c-a329-a754e92499ae",
    scopes={
        "api://7e7f855d-7451-4b60-b2bc-ef3f84b8ad0a/user_impersonation": "Acceso general a la API"
    }
)


token_auth_scheme = HTTPBearer()


async def obtener_usuario_actual(
    request: Request,
    token_bruto: HTTPAuthorizationCredentials = Depends(token_auth_scheme)
):
    """
    Esta función decide de dónde viene el token y lo valida.
    """

    try:
        
        usuario_azure = await azure_scheme(request)
        return {"origen": "azure", "datos": usuario_azure}
        
    except Exception:

        pass

    try:
        token_str = token_bruto.credentials
        
        # Aquí podrías agregar la lógica para validar el token con Supabase.

        pass
        
    except Exception:
        pass

    raise HTTPException(
        status_code=401,
        detail="No autorizado. El token no es válido para Azure ni para Supabase."
    )