from fastapi import FastAPI, Body, HTTPException
import motor.motor_asyncio
from .model.shop import ShopProfile
from bson import ObjectId
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.shop_service
shop_collection = db.get_collection("shops")


@app.get("/health")
async def health_check():
    try:
        await client.admin.command('ping')
        return {"status": "UP", "database": "Connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={
                            "status": "DOWN", "database": str(e)})


@app.post("/shops")
async def create_shop(request: ShopProfile = Body(...)):
    data = request.model_dump(by_alias=True, exclude=["id"])
    shop = await shop_collection.insert_one(data)
    created_student = await shop_collection.find_one(
        {"_id": shop.inserted_id}
    )
    return ShopProfile(**created_student)
