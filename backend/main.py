from fastapi import FastAPI
from routes.auth import auth_router
from routes.protected import protected_router

app = FastAPI()

# Registrar las rutas de autenticación y protegidas
app.include_router(auth_router, prefix="/auth")
app.include_router(protected_router)

# Ruta de prueba
@app.get("/")
async def read_root():
    return {"message": "API  online"}



