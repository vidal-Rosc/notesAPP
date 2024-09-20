from fastapi import FastAPI
from routes.auth import auth_router
from routes.notes import notes_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API de Notes",
    description="API to manage notes with JWT authentication",
    version="1.0.0",
)

# Configurar CORS
origins = [
    "http://localhost:3000",  # Dirección del frontend en desarrollo
    "https://tu-dominio-frontend.com",  # Dirección del frontend en producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir estos orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas de autenticación con el prefijo /auth
app.include_router(auth_router)

# Registrar las rutas de notas con el prefijo /notes
app.include_router(notes_router)

# Registrar las rutas de notas con el prefijo /protected
app.include_router(protected_router)

# Ruta de prueba
@app.get("/")
async def read_root():
    return {"message": "API working correctly"}




