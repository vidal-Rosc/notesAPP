from fastapi import APIRouter, Depends
from core.security import get_current_user

protected_router = APIRouter()

# Ruta protegida accesible solo con un token JWT válido
@protected_router.get("/protected")
async def read_protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Bienvenido, {current_user}. Access granted to this protected route."}
