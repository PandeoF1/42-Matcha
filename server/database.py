import asyncpg
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

async def get_database():
    connexion = await asyncpg.connect(SQLALCHEMY_DATABASE_URL)
    try:
        yield connexion
    finally:
        await connexion.close()