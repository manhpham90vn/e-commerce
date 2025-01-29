from abc import ABC, abstractmethod

from src.repository.shop import ShopRepositoryInterface

from src.models.shop import Shop
from src.response.shop_response import ShopResponse


class ShopServiceInterface(ABC):
    @abstractmethod
    def create_shop(self, shop: Shop) -> ShopResponse:
        pass


class ShopService(ShopServiceInterface):

    def __init__(self, repository: ShopRepositoryInterface):
        self.repository = repository

    async def create_shop(self, shop: Shop) -> ShopResponse:
        return await self.repository.create_shop(shop)
