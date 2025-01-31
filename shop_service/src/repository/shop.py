from abc import ABC, abstractmethod
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from src.models.shop import Shop
from src.request.create_shop import CreateShop
from src.request.update_shop import UpdateShop


class ShopRepositoryInterface(ABC):
    @abstractmethod
    def create_shop(self, request: CreateShop, user_id: int) -> Optional[Shop]:
        pass

    @abstractmethod
    def update(self, request: UpdateShop, shop_id: str, user_id: int) -> Optional[Shop]:
        pass

    @abstractmethod
    def get_shop(self, shop_id: str) -> Optional[Shop]:
        pass


class ShopRepository(ShopRepositoryInterface):

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_shop(self, request: CreateShop, user_id: int) -> Optional[Shop]:
        # Check if the shop already exists
        isExist = await self.collection.find_one({"user_id": user_id})

        if isExist:
            return None

        # Insert the shop
        data = request.model_dump(by_alias=True)
        shop = Shop(**data, user_id=user_id)
        inserted_shop = await self.collection.insert_one(shop)

        # Get the inserted shop
        shop_result = await self.collection.find_one(
            {"_id": inserted_shop.inserted_id}
        )
        res = Shop(**shop_result)
        return res.dict_without_timestamps()

    async def update(self, request: UpdateShop, shop_id: str, user_id: int) -> Optional[Shop]:
        shop_id = ObjectId(shop_id)

        # Check if the shop exists
        isExist = await self.collection.find_one({"_id": shop_id})
        if not isExist:
            return None

        # Check user is the owner of the shop
        isOwner = isExist.get("user_id") == user_id
        if not isOwner:
            return None

        # Check data is needed to update
        data = request.model_dump(by_alias=True)
        update_data = {key: value for key,
                       value in data.items() if value is not None}
        if not update_data:
            res = Shop(**isExist)
            return res.dict_without_timestamps()

        # Update the shop
        await self.collection.update_one({"_id": shop_id}, {"$set": update_data})

        # Get the updated shop
        shop_result = await self.collection.find_one({"_id": shop_id})
        res = Shop(**shop_result)
        return res.dict_without_timestamps()

    async def get_shop(self, shop_id: str) -> Optional[Shop]:
        shop_id = ObjectId(shop_id)

        # Get the shop
        shop_result = await self.collection.find_one({"_id": shop_id})
        if not shop_result:
            return None

        res = Shop(**shop_result)
        return res.dict_without_timestamps()
