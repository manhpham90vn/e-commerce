from abc import ABC, abstractmethod

from motor.motor_asyncio import AsyncIOMotorCollection
from src.models.shop import Shop


class ShopRepositoryInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: Shop) -> Shop:
        pass


class ShopRepository(ShopRepositoryInterface):

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_shop(self, shop: Shop) -> Shop:
        data = shop.model_dump(by_alias=True, exclude=["id"])
        inserted_shop = await self.collection.insert_one(data)
        shop_result = await self.collection.find_one(
            {"_id": inserted_shop.inserted_id}
        )
        res = Shop(**shop_result)
        return res.model_dump(by_alias=True, exclude=["created_at", "updated_at", "deleted_at"])
