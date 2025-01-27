import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase


class Database:
    def __init__(self, db_url: str):
        self.db_url = db_url

    def create_session(self):
        return motor.motor_asyncio.AsyncIOMotorClient(self.db_url)

    def create_db(self, session: AsyncIOMotorClient, db_name: str):
        return session[db_name]

    async def close(self, session: AsyncIOMotorClient):
        session.close()
