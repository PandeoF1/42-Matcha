import datetime
import asyncpg
import os
import dotenv

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

DB = None

async def get_database():
    global DB
    if DB is None:
        db_pool = await asyncpg.create_pool(DATABASE_URL)
        DB = db_pool
        async with db_pool.acquire() as conn:
            await conn.execute("""DELETE FROM token WHERE last_activity < $1""", datetime.datetime.now().timestamp() - 3600 * 6)
    return DB
