import asyncpg
import os
import dotenv


dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

DB = None


async def get_database():
    global DB
    if DB is None:
        DB = await asyncpg.connect(DATABASE_URL)
    return DB