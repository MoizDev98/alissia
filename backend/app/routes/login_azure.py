
from models.user_schemas import LoginAzureRequest
from models.users_model import User 

@router.post("/login-azure")
def login_con_azure(datos: LoginAzureRequest, db: Session = Depends(get_db)):
    usuario_encontrado = db.query(User).filter(User.email == datos.email).first()