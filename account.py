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

async def randomize():
    # Change age, geoloc and elo of all user in database
    db = await asyncpg.connect('postgresql://matchadmin:matchapasspas@localhost/matcha')
    users = await db.fetch("SELECT id FROM users")
    for user in users:
        geoloc = "%s,%s" % (random.uniform(48.8, 48.9), random.uniform(2.3, 2.4))
        age = random.randint(18, 99)
        elo = random.randint(0, 100)
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
        if (random.randint(0,1)):
            tag = {
  "#cinema": False,
  "#music": True,
  "#bar": True,
  "#hiking": True,
  "#biking": True,
  "#cooking": True,
  "#photography": True,
  "#gaming": False,
  "#reading": False,
  "#dancing": False,
  "#painting": False,
  "#skiing": False,
  "#traveling": False,
  "#yoga": False,
  "#gardening": False,
  "#fishing": False,
  "#surfing": False,
  "#golfing": False,
  "#wine": False,
  "#beer": False,
  "#coffee": False,
  "#tea": False,
  "#running": False,
  "#writing": False,
  "#knitting": True,
  "#crafting": True,
  "#theater": True,
  "#karaoke": True,
  "#camping": True,
  "#beach": True,
  "#concerts": True,
  "#museums": True,
  "#boardgames": False,
  "#puzzles": True,
  "#astronomy": True,
  "#stargazing": False,
  "#fitness": True,
  "#meditation": False,
  "#poetry": False,
  "#DIY": False,
  "#technology": False,
  "#vintage": False,
  "#cars": False,
  "#pets": False,
  "#sailing": False,
  "#rockclimbing": False,
  "#foodie": False,
  "#fashion": False,
  "#history": False,
  "#languages": False,
  "#poetry": False,
  "#filmlovers": False,
  "#musicians": True,
  "#gaming": False,
  "#outdoorlife": True,
  "#bookclub": True,
  "#photography": True,
  "#gamer": False,
  "#literature": True,
  "#art": False,
  "#traveling": True,
  "#winetasting": True,
  "#brewerytour": False,
  "#coffee": False,
  "#teatime": False,
  "#running": False,
  "#journaling": False,
  "#theater": False,
  "#campfire": False,
  "#beach": False,
  "#livemusic": False,
  "#museum": False,
  "#games": False,
  "#mindfulness": False,
  "#fishing": False,
  "#surfing": False,
  "#golfing": False,
  "#wine": False,
  "#beer": False,
  "#coffee": False,
  "#yoga": False,
  "#fashion": False,
  "#art": False,
  "#adventure": False
}
        else:
            tag = {
  "#cinema": True,
  "#music": True,
  "#bar": False,
  "#hiking": False,
  "#biking": False,
  "#cooking": False,
  "#photography": False,
  "#gaming": False,
  "#reading": True,
  "#dancing": False,
  "#painting": True,
  "#skiing": False,
  "#traveling": True,
  "#yoga": False,
  "#gardening": False,
  "#fishing": False,
  "#surfing": False,
  "#golfing": True,
  "#wine": False,
  "#beer": False,
  "#coffee": True,
  "#tea": False,
  "#running": False,
  "#writing": False,
  "#knitting": True,
  "#crafting": True,
  "#theater": False,
  "#karaoke": True,
  "#camping": False,
  "#beach": False,
  "#concerts": False,
  "#museums": True,
  "#boardgames": False,
  "#puzzles": True,
  "#astronomy": True,
  "#stargazing": False,
  "#fitness": False,
  "#meditation": False,
  "#poetry": True,
  "#DIY": False,
  "#technology": False,
  "#vintage": False,
  "#cars": False,
  "#pets": False,
  "#sailing": True,
  "#rockclimbing": False,
  "#foodie": False,
  "#fashion": True,
  "#history": False,
  "#languages": False,
  "#poetry": False,
  "#filmlovers": False,
  "#musicians": False,
  "#gaming": False,
  "#outdoorlife": False,
  "#bookclub": False,
  "#photography": False,
  "#gamer": False,
  "#literature": False,
  "#art": False,
  "#traveling": False,
  "#winetasting": False,
  "#brewerytour": False,
  "#coffee": False,
  "#teatime": True,
  "#running": True,
  "#journaling": False,
  "#theater": True,
  "#campfire": False,
  "#beach": True,
  "#livemusic": False,
  "#museum": False,
  "#games": False,
  "#mindfulness": False,
  "#fishing": True,
  "#surfing": False,
  "#golfing": True,
  "#wine": False,
  "#beer": True,
  "#coffee": False,
  "#yoga": True,
  "#fashion": False,
  "#art": False,
  "#adventure": False
}

        print(user['id'], geoloc, age, elo, gender, orientation, tag)
        await db.execute("UPDATE users SET (age, geoloc, elo, orientation, gender, tags) = ($1, $2, $3, $4, $5, $6) WHERE id = $7", age, geoloc, elo, orientation, gender, json.dumps(tag), user['id'])
            
        

if __name__ == "__main__":
#    for i in range(10):
#        asyncio.run(test_register())
    asyncio.run(randomize())
