import json
import random
import string
import requests
import asyncpg
import dotenv
import os

str = "".join(
    random.choices(
        string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10
    )
)
token = None
dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def generate_token():
    global token
    if token is not None:
        return token
    data = {"username": "%s" % str, "password": "Qw@rty123456"}
    response = requests.post(
        "https://back-matcha.pandeo.fr/user/login", json.dumps(data)
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Login Success"
    assert response.json()["token"] is not None
    token = response.json()["token"]
    return token


async def generate_id():
    db = await asyncpg.connect(DATABASE_URL)
    _id = await db.fetchrow("SELECT id FROM users")
    await db.close()
    return _id["id"]

TAGS = {
    "#cinema" : False,
    "#music" : False,
    "#bar" : False,
    "#hiking" : False,
    "#biking" : False,
    "#cooking" : False,
    "#photography" : False,
    "#gaming" : False,
    "#reading" : False,
    "#dancing" : False,
    "#painting" : False,
    "#skiing" : False,
    "#traveling" : False,
    "#yoga" : False,
    "#gardening" : False,
    "#fishing" : False,
    "#surfing" : False,
    "#golfing" : False,
    "#wine" : False,
    "#beer" : False,
    "#coffee" : False,
    "#tea" : False,
    "#running" : False,
    "#writing" : False,
    "#knitting" : False,
    "#crafting" : False,
    "#theater" : False,
    "#karaoke" : False,
    "#camping" : False,
    "#beach" : False,
    "#concerts" : False,
    "#museums" : False,
    "#boardgames" : False,
    "#puzzles" : False,
    "#astronomy" : False,
    "#stargazing" : False,
    "#fitness" : False,
    "#meditation" : False,
    "#poetry" : False,
    "#DIY" : False,
    "#technology" : False,
    "#vintage" : False,
    "#cars" : False,
    "#pets" : False,
    "#sailing" : False,
    "#rockclimbing" : False,
    "#foodie" : False,
    "#fashion" : False,
    "#history" : False,
    "#languages" : False,
    "#filmlovers" : False,
    "#musicians" : False,
    "#outdoorlife" : False,
    "#bookclub" : False,
    "#gamer" : False,
    "#literature" : False,
    "#art" : False,
    "#winetasting" : False,
    "#brewerytour" : False,
    "#teatime" : False,
    "#journaling" : False,
    "#campfire" : False,
    "#livemusic" : False,
    "#museum" : False,
    "#games" : False,
    "#mindfulness" : False,
    "#adventure" : False
}