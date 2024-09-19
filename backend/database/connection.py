from pymongo import MongoClient
from core.config import MONGO_URL

client = MongoClient(MONGO_URL)
db = client['notas_db']
users_collection = db['users']
