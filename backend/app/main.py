from fastapi import FastAPI
from routes.user_routes import user_router
from fastapi.middleware.cors import CORSMiddleware
from routes.plan_routes import plan_router
from routes.ia_routes import ia_router
from routes.profile_routes import profile_router
from contextlib import asynccontextmanager
from core.security import azure_scheme
from routes.contextura_routes import contextura_router
from routes.weight_routes import weight_router
from routes.recommendation_routes import recommendation_router
from routes.meal_routes import meal_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Descargando configuración de seguridad de Microsoft Azure...")
    await azure_scheme.openid_config.load_config()
    print("¡Seguridad de Azure cargada correctamente!")
    yield

app = FastAPI(
    title="Alissia API",
    description="API para proyecto Alissia",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:4200",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(ia_router)
app.include_router(profile_router)
app.include_router(plan_router)
app.include_router(contextura_router)
app.include_router(weight_router)
app.include_router(recommendation_router)
app.include_router(meal_router)

@app.get("/")
def home():
    return {"largos dias y placenteras noches pistoleros"}



