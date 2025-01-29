import os

import httpx
from dependency_injector import containers, providers
from dotenv import load_dotenv
from src.database import Database
from src.repository.shop import ShopRepository
from src.service.shop import ShopService

load_dotenv()


class Container(containers.DeclarativeContainer):

    wiring_config = containers.WiringConfiguration(
        modules=[
            'src.routers.shop',
            'src.middleware.auth',
        ]
    )

    # Configs
    db_url = providers.Factory(lambda: os.getenv("MONGODB_URL"))
    db_name = providers.Factory(lambda: os.getenv("DB_NAME"))
    auth_service_url = providers.Factory(lambda: os.getenv("AUTH_SERVICE_URL"))

    # Database
    db = providers.Singleton(Database, db_url=db_url())
    session = providers.Singleton(lambda db=db: db().create_session())

    db_instance = providers.Singleton(
        lambda db=db, session=session, db_name=db_name: db().create_db(
            session=session(), db_name=db_name())
    )

    shop_collection = providers.Singleton(
        lambda db_instance=db_instance: db_instance().get_collection("shops"))

    # Repositories
    shop_repository = providers.Factory(
        ShopRepository, collection=shop_collection)

    # Services
    shop_service = providers.Factory(
        ShopService, repository=shop_repository)

    # Middleware
    http_client = providers.Singleton(httpx.AsyncClient)
