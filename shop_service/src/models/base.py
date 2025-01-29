from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BaseMongoModel(BaseModel):
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
