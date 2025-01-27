from fastapi import FastAPI
from src.containers import Container
from src.routers.shop import route


def create_app():
    container = Container()
    app = FastAPI()
    app.container = container
    app.include_router(route)
    return app


app = create_app()
