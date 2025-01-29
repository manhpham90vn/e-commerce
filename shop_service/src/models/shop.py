from typing import Optional

from pydantic import EmailStr, Field
from src.models.base import BaseMongoModel


class Shop(BaseMongoModel):
    name: str = Field(..., max_length=100, description="Shop name")
    user_id: int = Field(..., description="User id")
    description: Optional[str] = Field(
        None, max_length=500, description="Shop description")
    location: Optional[str] = Field(
        None, max_length=200, description="Shop address")
    contact: Optional[EmailStr] = Field(None, description="Contact email")
