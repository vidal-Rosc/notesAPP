from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional

###### Usuarios #####

# Tipos de fuentes permitidas
ALLOWED_FONT_TYPES = ["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"]


#Registro de Usuarios
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

###### Notas #####
#Define los campos básicos de una nota.
class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1)
    font_type: Optional[str] = Field("Arial", description="Font type")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @validator('font_type')
    def validate_font_type(cls, v):
        if v not in ALLOWED_FONT_TYPES:
            raise ValueError(f"Font type not allowed. The font type allowed: {', '.join(ALLOWED_FONT_TYPES)}")
        return v
    
    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Empty title  are NOT allowed')
        return v
    
    @validator('content')
    def content_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Empty content are NOT allowed')
        return v

#Hereda de NoteBase y se utiliza para la creación de notas
class NoteCreate(NoteBase):
    pass

# Esquema para actualizar una nota existente
class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, min_length=1)
    font_type: Optional[str] = Field(None, description="Font type")

    @validator('font_type')
    def validate_font_type(cls, v):
        if v and v not in ALLOWED_FONT_TYPES:
            raise ValueError(f"Font type not allowed. The font type allowed: {', '.join(ALLOWED_FONT_TYPES)}")
        return v

    @validator('title')
    def title_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Empty title  are NOT allowed')
        return v

    @validator('content')
    def content_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Empty content are NOT allowed')
        return v

# Representa una nota completa, incluyendo el id y el owner (propietario).
class Note(NoteBase):
    id: str
    owner: str

    class Config:
        from_attributes = True

# Esquema para los tokens
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

# Esquema para refrescar el access token
class TokenRefresh(BaseModel):
    refresh_token: str