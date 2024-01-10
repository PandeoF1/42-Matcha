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
        DB = await asyncpg.connect(DATABASE_URL)
        await DB.execute("""DELETE FROM token WHERE last_activity < $1""", datetime.datetime.now().timestamp() - 3600 * 6)
    return DB