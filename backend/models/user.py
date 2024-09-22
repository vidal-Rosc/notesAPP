from pymongo.collection import Collection
from bson.objectid import ObjectId
from core.schemas import UserCreate
from core.security import get_password_hash
import hashlib

def get_users_collection(db) -> Collection:
    return db.get_collection("users")

def create_user(db, user: UserCreate):
    users = get_users_collection(db)
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "password": hashed_password,
        "refresh_tokens": []  # Lista para almacenar los hassh de los refresh tokens
    }
    result = users.insert_one(user_dict)
    return str(result.inserted_id)

def get_user_by_username(db, username: str):
    users = get_users_collection(db)
    return users.find_one({"username": username})

##### Tokens #####
# Agrega un nuevo refresh token al usuario y almacena el hash del refresh token en la base de datos.
def add_refresh_token(db, username: str, refresh_token: str):
    users = get_users_collection(db)
    refresh_token_hash = hash_refresh_token(refresh_token)
    users.update_one(
        {"username": username},
        {"$push": {"refresh_tokens": refresh_token}}
    )

#  Elimina un refresh token específico del usuario
def remove_refresh_token(db, username: str, refresh_token: str):
    users = get_users_collection(db)
    users.update_one(
        {"username": username},
        {"$pull": {"refresh_tokens": refresh_token}}
    )

#  Elimina todos los refresh tokens del usuario 
def remove_all_refresh_tokens(db, username: str):
    users = get_users_collection(db)
    users.update_one(
        {"username": username},
        {"$set": {"refresh_tokens": []}}
    )
    
# Utiliza SHA-256 para hashear el refresh token
def hash_refresh_token(refresh_token: str) -> str:
    return hashlib.sha256(refresh_token.encode('utf-8')).hexdigest()

# Verifica si el hash del refresh token existe en la base de datos.
def verify_refresh_token(db, username: str, refresh_token: str) -> bool:
    users = get_users_collection(db)
    refresh_token_hash = hash_refresh_token(refresh_token)
    user = users.find_one({"username": username, "refresh_tokens": refresh_token_hash})
    return user is not None