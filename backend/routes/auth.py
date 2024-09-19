from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from core.security import create_access_token, get_password_hash, verify_password
from core.config import MONGODB_URI, MONGODB_DB

auth_router = APIRouter()

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
users_collection = db["users"]

# Ruta para registrar un nuevo usuario
@auth_router.post("/register")
async def register(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    hashed_password = get_password_hash(password)
    users_collection.insert_one({"username": username, "password": hashed_password})
    
    return {"message": "User Susccesfully registered"}

# Ruta para hacer login
@auth_router.post("/login")
async def login(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Wrong credentials")
    
    # Crear token JWT
    access_token = create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}

