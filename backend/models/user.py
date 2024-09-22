from pymongo.collection import Collection
from bson.objectid import ObjectId
from core.schemas import UserCreate
from core.security import get_password_hash, hash_refresh_token, verify_refresh_token_hash

def get_users_collection(db) -> Collection:
    return db.get_collection("users")

def create_user(db, user: UserCreate):
    users = get_users_collection(db)
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "password": hashed_password,
        "refresh_tokens": []  # Lista para almacenar los hashes de los refresh tokens
    }
    result = users.insert_one(user_dict)
    return str(result.inserted_id)

def get_user_by_username(db, username: str):
    users = get_users_collection(db)
    return users.find_one({"username": username})

def add_refresh_token(db, username: str, refresh_token: str):
    users = get_users_collection(db)
    hashed_token = hash_refresh_token(refresh_token)
    users.update_one(
        {"username": username},
        {"$push": {"refresh_tokens": hashed_token}}
    )

def remove_refresh_token(db, username: str, refresh_token: str):
    users = get_users_collection(db)
    hashed_token = hash_refresh_token(refresh_token)
    users.update_one(
        {"username": username},
        {"$pull": {"refresh_tokens": hashed_token}}
    )

def remove_all_refresh_tokens(db, username: str):
    users = get_users_collection(db)
    users.update_one(
        {"username": username},
        {"$set": {"refresh_tokens": []}}
    )