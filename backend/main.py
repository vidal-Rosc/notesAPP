from fastapi import FastAPI
from routes.auth import auth_router
from routes.protected import protected_router

app = FastAPI()

# Registrar el router de autenticación
app.include_router(auth_router, prefix="/auth")

# Registrar el router de rutas protegidas
app.include_router(protected_router)

# Ruta de prueba
@app.get("/")
async def read_root():
    return {"message": "API funcionando correctamente"}


