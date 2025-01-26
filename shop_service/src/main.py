from fastapi import FastAPI, Body, HTTPException
import motor.motor_asyncio
from .model.shop import ShopProfile
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Connect to MongoDB
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]
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
    inserted_shop = await shop_collection.insert_one(data)
    shop = await shop_collection.find_one(
        {"_id": inserted_shop.inserted_id}
    )
    return ShopProfile(**shop)
