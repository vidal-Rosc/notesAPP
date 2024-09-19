from fastapi import APIRouter, HTTPException
from models.user import User
from database.connection import users_collection
from core.security import hash_password, verify_password, create_access_token
from datetime import timedelta

auth_router = APIRouter()

# Ruta de registro
@auth_router.post("/register")
async def register(user: User):
    # Verifica si el usuario ya existe
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Registered user")
    
    # Hashear la contraseña antes de guardarla
    hashed_password = hash_password(user.password)

    # Guardar el usuario con la contraseña hasheada
    users_collection.insert_one({"username": user.username, "password": hashed_password})
    
    return {"message": "User successfully registered"}

# Ruta de login
@auth_router.post("/login")
async def login(user: User):
    # Buscar el usuario en la base de datos
    db_user = users_collection.find_one({"username": user.username})
    
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Verificar la contraseña ingresada con la contraseña hasheada en la base de datos
    if not verify_password(user.password, db_user['password']):
        raise HTTPException(status_code=400, detail="Wrong password, try again..")

    # Crear un token JWT
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}
