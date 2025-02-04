from abc import ABC, abstractmethod
from typing import Optional

from src.models.shop import Shop
from src.repository.shop import ShopRepositoryInterface
from src.request.create_shop import CreateShop
from src.request.update_shop import UpdateShop


class ShopServiceInterface(ABC):
    @abstractmethod
    def create_shop(self, request: CreateShop, user_id: int) -> Optional[Shop]:
        pass

    @abstractmethod
    def update(self, request: UpdateShop, shop_id: str, user_id: int) -> Optional[Shop]:
        pass

    @abstractmethod
    def get_shop(self, shop_id: str) -> Optional[Shop]:
        pass


class ShopService(ShopServiceInterface):

    def __init__(self, repository: ShopRepositoryInterface):
        self.repository = repository

    async def create_shop(self, request: CreateShop, user: int) -> Optional[Shop]:
        return await self.repository.create_shop(request, user)

    async def update(self, request: UpdateShop, shop_id: str, user_id: int) -> Optional[Shop]:
        return await self.repository.update(request, shop_id, user_id)

    async def get_shop(self, shop_id: str) -> Optional[Shop]:
        return await self.repository.get_shop(shop_id)
