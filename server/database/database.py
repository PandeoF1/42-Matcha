import datetime
import asyncpg
import os
import dotenv

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

async def get_database():
    connexion = await asyncpg.connect(DATABASE_URL)
    try:
        yield connexion
    except:
        print("Error")
    finally:
        if connexion:
            await connexion.close()