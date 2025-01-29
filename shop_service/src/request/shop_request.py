from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class ShopRequest(BaseModel):
    name: str = Field(..., max_length=100, description="Shop name")
    description: Optional[str] = Field(
        None, max_length=500, description="Shop description")
    location: Optional[str] = Field(
        None, max_length=200, description="Shop address")
    contact: Optional[EmailStr] = Field(None, description="Contact email")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
