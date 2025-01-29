from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class ShopResponse(BaseModel):
    id: Optional[PyObjectId] = Field(
        default=None,
        validation_alias="_id",
        serialization_alias="id"
    )
    name: str
    user_id: int
    description: Optional[str]
    location: Optional[str]
    contact: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(
        allow_population_by_field_name=True,
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
