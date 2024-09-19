from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from core.security import create_access_token, get_password_hash, verify_password
from core.config import MONGODB_URI, MONGODB_DB
from core.schemas import UserCreate, UserLogin  # Importamos los esquemas

auth_router = APIRouter()

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
users_collection = db["users"]

# Ruta para registrar un nuevo usuario
@auth_router.post("/register")
async def register(user: UserCreate):
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    hashed_password = get_password_hash(user.password)
    users_collection.insert_one({"username": user.username, "password": hashed_password})
    
    return {"message": "User susccesfully registered"}

# Ruta para hacer login
@auth_router.post("/login")
async def login(user: UserLogin):
    existing_user = users_collection.find_one({"username": user.username})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    # Crear token JWT
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



