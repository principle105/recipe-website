from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from config import CONFIG
from database.models import Recipe, User

app = FastAPI()


@app.on_event("startup")
async def app_init():
    app.db = AsyncIOMotorClient(CONFIG.mongo_uri).account
    await init_beanie(app.db, document_models=[User, Recipe])
