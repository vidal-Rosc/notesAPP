from fastapi import APIRouter, Depends
from core.security import get_current_user

protected_router = APIRouter()

# Ruta protegida para pruebas accesible solo con un token JWT válido
@protected_router.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user}. Access granted to this protected route."}
