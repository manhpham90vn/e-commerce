from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ShopResponse(BaseModel):
    _id: str
    name: str
    user_id: int
    description: Optional[str]
    location: Optional[str]
    contact: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
