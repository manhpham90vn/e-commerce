from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Body, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from src.containers import Container
from src.middleware.auth import verify_token
from src.request.create_shop import CreateShop
from src.request.update_shop import UpdateShop
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
async def create_shop(request: CreateShop = Body(...),
                      user_data: dict = Depends(verify_token),
                      shop_service: ShopServiceInterface = Depends(
                          Provide[Container.shop_service]),
                      ):
    result = await shop_service.create_shop(request, user_data["id"])

    if not result:
        raise HTTPException(status_code=400, detail="Shop already exists")
    return result


@route.post("/shops/{shop_id}")
@inject
async def update_shop(shop_id: str,
                      request: UpdateShop = Body(...),
                      user_data: dict = Depends(verify_token),
                      shop_service: ShopServiceInterface = Depends(
                          Provide[Container.shop_service]),
                      ):
    result = await shop_service.update(request, shop_id, user_data["id"])

    if not result:
        raise HTTPException(
            status_code=404, detail="Shop not found or you are not the owner")

    return result


@route.get("/shops/{shop_id}")
@inject
async def get_shop(shop_id: str,
                   shop_service: ShopServiceInterface = Depends(
                       Provide[Container.shop_service]),
                   ):
    result = await shop_service.get_shop(shop_id)

    if not result:
        raise HTTPException(status_code=404, detail="Shop not found")
    return result
