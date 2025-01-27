from fastapi import APIRouter, Depends
from fastapi import Body, HTTPException
from src.models.shop import ShopProfile
from dependency_injector.wiring import Provide, inject
from src.containers import Container
from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorClient

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
async def create_shop(request: ShopProfile = Body(...), shop_collection: AsyncIOMotorCollection = Depends(Provide[Container.shop_collection])):
    data = request.model_dump(by_alias=True, exclude=["id"])
    inserted_shop = await shop_collection.insert_one(data)
    shop = await shop_collection.find_one(
        {"_id": inserted_shop.inserted_id}
    )
    return ShopProfile(**shop)
