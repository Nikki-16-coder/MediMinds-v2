from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    gender: Optional[str] = None
    age: Optional[int] = None
    goals: Optional[List[str]] = []


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str = Field(alias="_id")
    gender: Optional[str] = None
    age: Optional[int] = None
    goals: Optional[List[str]] = []
    created_at: datetime
    last_login: Optional[datetime] = None


class UserInDB(UserBase):
    hashed_password: str
    gender: Optional[str] = None
    age: Optional[int] = None
    goals: Optional[List[str]] = []
    created_at: datetime
    last_login: Optional[datetime] = None
