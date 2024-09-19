from pydantic import BaseModel

# Esquema para la solicitud de registro de usuario
class UserCreate(BaseModel):
    username: str
    password: str

# Esquema para la solicitud de login de usuario
class UserLogin(BaseModel):
    username: str
    password: str
