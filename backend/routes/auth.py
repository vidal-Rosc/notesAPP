from fastapi import APIRouter, HTTPException, Depends, status
from core.schemas import UserCreate, UserLogin, Token, TokenRefresh
from models.user import (
    create_user,
    get_user_by_username,
    add_refresh_token,
    remove_refresh_token,
    remove_all_refresh_tokens,
    verify_refresh_token
)
from core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_current_user
)
from core.config import MONGODB_URI, MONGODB_DB, SECRET_KEY, ALGORITHM
from pymongo import MongoClient
from typing import Optional
from jose import JWTError, jwt

auth_router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

# Ruta para registrar un nuevo usuario
@auth_router.post("/register", response_model=dict)
async def register(user: UserCreate):
    existing_user = get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already created")
    
    user_id = create_user(db, user)
    return {"message": "Usuario registrado exitosamente", "user_id": user_id}

# Ruta para hacer login y obtener tokens
@auth_router.post("/login", response_model=Token)
async def login(user: UserLogin):
    existing_user = get_user_by_username(db, user.username)
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Crear tokens
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    # Almacenar el hash del refresh token en la base de datos
    add_refresh_token(db, user.username, refresh_token)
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Ruta para refrescar el access token
@auth_router.post("/refresh", response_model=Token)
async def refresh_token(token_refresh: TokenRefresh):
    try:
        payload = jwt.decode(token_refresh.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    # Verificar que el refresh token está almacenado en la base de datos
    if not verify_refresh_token(db, username, token_refresh.refresh_token):
        raise HTTPException(status_code=401, detail="Invalid/Expired Token")
    
    # Crear nuevos tokens
    new_access_token = create_access_token(data={"sub": username})
    new_refresh_token = create_refresh_token(data={"sub": username})
    
    # Actualizar refresh tokens en la base de datos
    remove_refresh_token(db, username, token_refresh.refresh_token)
    add_refresh_token(db, username, new_refresh_token)
    
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

# Ruta para cerrar sesión (invalidar un refresh token específico)
@auth_router.post("/logout", response_model=dict)
async def logout(token_refresh: TokenRefresh, current_user: str = Depends(get_current_user)):
    # Eliminar el hash del refresh token de la base de datos
    remove_refresh_token(db, current_user, token_refresh.refresh_token)
    return {"message": "Good bye... Logout"}

# Ruta para cerrar sesión en todos los dispositivos (invalidar todos los refresh tokens)
@auth_router.post("/logout_all", response_model=dict)
async def logout_all(current_user: str = Depends(get_current_user)):
    # Eliminar todos los refresh tokens del usuario
    remove_all_refresh_tokens(db, current_user)
    return {"message": "Logout from ALL devices"}





