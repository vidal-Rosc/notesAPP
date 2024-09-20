from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from core.security import create_access_token, verify_password, get_current_user
from core.config import MONGODB_URI, MONGODB_DB
from core.schemas import UserCreate, UserLogin  # Importamos los esquemas
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_MINUTES
from models.user import create_user, get_user_by_username

auth_router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
users_collection = db["users"]

# Ruta para registrar un nuevo usuario
@auth_router.post("/register", response_model=dict)
async def register(user: UserCreate):
    existing_user = get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    user_id = create_user(db, user)
    return {"message": "User susccesfully registered", "user_id": user_id}

# Ruta para hacer login
@auth_router.post("/login", response_model=dict)
async def login(user: UserLogin):
    existing_user = get_user_by_username(db, user.username)
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    # Crear token JWT
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



