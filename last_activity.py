#!/usr/bin/env python3
import asyncio
import json
import string
import asyncpg
import requests
import random
from datetime import datetime, timedelta
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
    users = await db.fetch("SELECT id FROM users")
    for user in users:
        geoloc = "%s,%s" % (random.uniform(48.8, 48.9), random.uniform(2.3, 2.4))
        # randomize images
        _images = []
        for i in range(5):
            _images.append(random.choice(images))
        # geoloc = "0,0"
        age = random.randint(1, 99)
        elo = random.randint(0, 1000)
        # gender
        if (random.randint(0,1)):
            gender = "male"
        else:
            gender = "female"
        # orientation
        if (random.randint(0,1)):
            orientation = "heterosexual"
        elif (random.randint(0,1)):
            orientation = "homosexual"
        else:
            orientation = "bisexual"
        tags = {}
        for tag in TAGS:
            tags[tag] = True if random.randint(0,6) == 5 else False

        print(user['id'], geoloc, age, elo, gender, orientation, tags)
        # random last_activity in timestamp
        aujourd_hui = datetime.today()

        # Définition de la date de la semaine dernière
        semaine_derniere = aujourd_hui - timedelta(days=10)

        # Génération d'un timestamp aléatoire entre aujourd'hui et la semaine dernière
        date = semaine_derniere + timedelta(seconds=random.randint(0, int((aujourd_hui - semaine_derniere).total_seconds())))
        date = date.timestamp()
        await db.execute("UPDATE users SET last_activity = $1 WHERE id = $2", date, user['id'])
        
        #await db.execute("UPDATE users SET (age, geoloc, elo, orientation, gender, tags, images, completion, bio) = ($1, $2, $3, $4, $5, $6, $7, 2, 'Dolore aliquam quaerat dolor.Dolore aliquam quaerat dolor.Dolore aliquam quaerat dolor.Dolore aliquam quaerat dolor.') WHERE id = $8", age, geoloc, elo, orientation, gender, json.dumps(tags), _images, user['id'])

if __name__ == "__main__":
#    for i in range(10):
#        asyncio.run(test_register())
    asyncio.run(randomize())
