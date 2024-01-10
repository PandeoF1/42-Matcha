import psycopg2
import os
import dotenv


dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

CONN = None
DB = None

async def get_database():
    global DB
    if DB is None:
        CONN =  psycopg2.connect(DATABASE_URL)
        DB = CONN.cursor()
    return DB
