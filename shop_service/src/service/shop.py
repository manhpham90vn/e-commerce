from abc import ABC, abstractmethod
from typing import Optional

from src.models.shop import Shop
from src.repository.shop import ShopRepositoryInterface


class ShopServiceInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: Shop) -> Optional[Shop]:
        pass

    @abstractmethod
    def update(self, shop: Shop) -> Optional[Shop]:
        pass

    @abstractmethod
    def get_shop(self, shop_id: str) -> Optional[Shop]:
        pass


class ShopService(ShopServiceInterface):

    def __init__(self, repository: ShopRepositoryInterface):
        self.repository = repository

    async def create_shop(self, shop: Shop) -> Optional[Shop]:
        return await self.repository.create_shop(shop)

    async def update(self, shop: Shop) -> Optional[Shop]:
        return await self.repository.update(shop)

    async def get_shop(self, shop_id: str) -> Optional[Shop]:
        return await self.repository.get_shop(shop_id)
