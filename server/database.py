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
        print ("Error")
    finally:
        if connexion:
            await connexion.close()

async def create_user(db, username, password, email):
    try:
        await db.execute("INSERT INTO users (firstname, lastname, password, images, status, completion, last_activity, gender, orientation, tags, elo, bio, geoloc, birthdate, email, username) VALUES ('', '', $1, [], true, '', '', '', '', '', '', '', '', '', $2, $3)", password, email, username)
    except Exception as e:
        print (e)