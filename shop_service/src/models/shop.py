from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


class ShopProfile(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., max_length=100, description="Shop name")
    description: Optional[str] = Field(
        None, max_length=500, description="Shop description")
    location: Optional[str] = Field(
        None, max_length=200, description="Shop address")
    contact: Optional[EmailStr] = Field(None, description="Contact email")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation time")
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Last update time")
    deleted_at: Optional[datetime] = Field(None, description="Deletion time")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "My Shop",
                "description": "This is a shop",
                "location": "123, Main Street",
                "contact": "test@test.com"
            },
        }
    )
