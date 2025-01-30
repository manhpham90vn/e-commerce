from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from src.models.base import PyObjectId


class Shop(BaseModel):
    id: Optional[PyObjectId] = Field(
        default=None,
        validation_alias="_id",
        serialization_alias="id"
    )
    name: Optional[str] = Field(..., max_length=100, description="Shop name")
    user_id: int = Field(..., description="User id")
    description: Optional[str] = Field(
        None, max_length=500, description="Shop description")
    location: Optional[str] = Field(
        None, max_length=200, description="Shop address")
    contact: Optional[EmailStr] = Field(None, description="Contact email")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation time")
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Last update time")
    deleted_at: Optional[datetime] = Field(
        None, description="Deletion time")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    def dict_without_timestamps(self, **kwargs):
        return self.model_dump(by_alias=True, exclude=["created_at", "updated_at", "deleted_at"], **kwargs)
