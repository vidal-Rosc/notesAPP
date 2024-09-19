from fastapi import APIRouter, Depends
from core.security import get_current_user

# Crear un router para las rutas protegidas
protected_router = APIRouter()

# Ruta protegida, solo accesible si el token JWT es válido
@protected_router.get("/protected")
async def read_protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user}. Access granted to this protected route."}
