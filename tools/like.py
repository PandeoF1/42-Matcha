#!/usr/bin/env python3
import asyncio
import json
import string
import asyncpg
import requests
import random

# for 100 times
async def test_register():
    # generate a random email
    email = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10)) + "@nofoobar.com"
    # send a request to register
    r = requests.post("https://back-matcha.pandeo.fr/user", json={
        "username": "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10)),
        "password": "Test123467895!",
        "firstName": "test",
        "lastName": "test",
        "email": email
    })
    # print the response
    print(r.json())

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



async def randomize():
    images = [
    "https://back-matcha.pandeo.fr/image/c319776c-41e6-4af7-b3c7-edf10cbcb58d",
    "https://back-matcha.pandeo.fr/image/6028d1e6-ed7b-49a5-9a5f-ea198d78a267",
    "https://back-matcha.pandeo.fr/image/5b5f0ee0-82a1-409a-abe2-c9abd689cf37",
    "https://back-matcha.pandeo.fr/image/8be086da-82b9-4eda-8465-e0715ff080c8",
    "https://back-matcha.pandeo.fr/image/5eb8b985-9f7f-4d99-8885-82a114d4e307"
  ]
    # Change age, geoloc and elo of all user in database
    db = await asyncpg.connect('postgresql://matchadmin:matchapasspas@localhost/matcha')
    # delete * from interactions
    await db.execute("delete from interactions")
if __name__ == "__main__":
#    for i in range(10):
#        asyncio.run(test_register())
    asyncio.run(randomize())
