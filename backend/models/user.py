from pymongo.collection import Collection
from bson.objectid import ObjectId
from core.schemas import UserCreate
from core.security import get_password_hash

def get_users_collection(db) -> Collection:
    return db.get_collection("users")

def create_user(db, user: UserCreate):
    users = get_users_collection(db)
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "password": hashed_password,
        "refresh_tokens": []  # Lista para almacenar los refresh tokens
    }
    result = users.insert_one(user_dict)
    return str(result.inserted_id)

def get_user_by_username(db, username: str):
    users = get_users_collection(db)
    return users.find_one({"username": username})

##### Tokens #####
# Agrega un nuevo refresh token al usuario.
def add_refresh_token(db, username: str, refresh_token: str):
    users = get_users_collection(db)
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
