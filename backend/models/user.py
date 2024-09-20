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
        "password": hashed_password
    }
    result = users.insert_one(user_dict)
    return str(result.inserted_id)

def get_user_by_username(db, username: str):
    users = get_users_collection(db)
    return users.find_one({"username": username})

