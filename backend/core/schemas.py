from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

#Usuarios
#Creacion de Usuarios
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.isalnum(), 'The Username must be alphanumeric'
        return v

#Login  de Usuarios
class UserLogin(BaseModel):
    username: str
    password: str

#Notas
#Define los campos básicos de una nota.
class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

#Hereda de NoteBase y se utiliza para la creación de notas
class NoteCreate(NoteBase):
    pass

# Define los campos que pueden actualizarse.
class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, min_length=1)

# Representa una nota completa, incluyendo el id y el owner (propietario).
class Note(NoteBase):
    id: str
    owner: str

    class Config:
        orm_mode = True
