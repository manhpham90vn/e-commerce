from abc import ABC, abstractmethod

from motor.motor_asyncio import AsyncIOMotorCollection
from src.models.shop import Shop
from src.response.shop_response import ShopResponse


class ShopRepositoryInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: Shop) -> ShopResponse:
        pass


class ShopRepository(ShopRepositoryInterface):

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_shop(self, shop: Shop) -> ShopResponse:
        data = shop.model_dump(by_alias=True, exclude=["id"])
        inserted_shop = await self.collection.insert_one(data)
        shop_result = await self.collection.find_one(
            {"_id": inserted_shop.inserted_id}
        )
        return ShopResponse(**shop_result)
