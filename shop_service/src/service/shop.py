from abc import ABC, abstractmethod
from src.models.shop import ShopProfile
from src.repository.shop import ShopRepositoryInterface


class ShopServiceInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: ShopProfile, user_data: dict) -> ShopProfile:
        pass


class ShopService(ShopServiceInterface):

    def __init__(self, repository: ShopRepositoryInterface):
        self.repository = repository

    async def create_shop(self, shop: ShopProfile, user_data: dict) -> ShopProfile:
        return await self.repository.create_shop(shop, user_data)
