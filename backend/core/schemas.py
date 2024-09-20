from pydantic import BaseModel, Field, validator

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

    @validator('username')
    def username_alphanumeric(cls, v):
        assert v.isalnum(), 'The Username must be alphanumeric'
        return v

class UserLogin(BaseModel):
    username: str
    password: str
