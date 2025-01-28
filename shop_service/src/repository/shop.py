from abc import ABC, abstractmethod
from motor.motor_asyncio import AsyncIOMotorCollection
from src.models.shop import ShopProfile


class ShopRepositoryInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: ShopProfile, user_data: dict) -> dict:
        pass


class ShopRepository(ShopRepositoryInterface):

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_shop(self, shop: ShopProfile, user_data: dict) -> ShopProfile:
        data = shop.model_dump(by_alias=True, exclude=["id"])
        data["user_id"] = user_data["id"]
        inserted_shop = await self.collection.insert_one(data)
        shop_result = await self.collection.find_one(
            {"_id": inserted_shop.inserted_id}
        )
        return ShopProfile(**shop_result)
