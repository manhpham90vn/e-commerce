from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Body, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from src.containers import Container
from src.middleware.auth import verify_token
from src.models.shop import Shop
from src.request.shop_request import ShopRequest
from src.service.shop import ShopServiceInterface

route = APIRouter(prefix="/api/shop_service/v1", tags=["Shops"])


@route.get("/health")
@inject
async def health_check(db_instance: AsyncIOMotorClient = Depends(Provide[Container.db_instance])):
    try:
        await db_instance.client.admin.command('ping')
        return {"status": "UP", "database": "Connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={
                            "status": "DOWN", "database": str(e)})


@route.post("/shops")
@inject
async def create_shop(request: ShopRequest = Body(...),
                      user_data: dict = Depends(verify_token),
                      shop_service: ShopServiceInterface = Depends(
                          Provide[Container.shop_service]),
                      ):
    shop_request = request.model_dump(by_alias=True)
    shop_request["user_id"] = user_data["id"]
    shop = Shop(**shop_request)
    return await shop_service.create_shop(shop)
