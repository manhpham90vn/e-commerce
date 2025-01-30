from abc import ABC, abstractmethod

from src.models.shop import Shop
from src.repository.shop import ShopRepositoryInterface


class ShopServiceInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: Shop) -> Shop:
        pass


class ShopService(ShopServiceInterface):

    def __init__(self, repository: ShopRepositoryInterface):
        self.repository = repository

    async def create_shop(self, shop: Shop) -> Shop:
        return await self.repository.create_shop(shop)
