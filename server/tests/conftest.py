import json
import random
import string
import requests
import asyncpg
import dotenv
import os

str = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10))
token = None
dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def generate_token():
    global token
    if token is not None:
        return token
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    assert response.status_code == 200
    assert response.json()['message'] == 'Login Success'
    assert response.json()['token'] is not None
    token = response.json()['token']
    return token

async def generate_id():
    db = await asyncpg.connect(DATABASE_URL)
    _id = await db.fetchrow("SELECT id FROM users")
    await db.close()
    return _id['id']
    