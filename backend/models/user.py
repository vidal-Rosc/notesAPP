from pydantic import BaseModel

# Modelo de usuario
class User(BaseModel):
    username: str
    password: str
