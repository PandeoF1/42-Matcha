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
        age = random.randint(18, 50)
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
            tag = {"vegan": True, "vegetarian": False, "pescetarian": False, "kosher": False, "halal": False}
        else:
            tag = {"vegan": False, "vegetarian": True, "pescetarian": False, "kosher": False, "halal": False}

        print(user['id'], geoloc, age, elo, gender, orientation, tag)
        await db.execute("UPDATE users SET (age, geoloc, elo, orientation, gender, tags) = ($1, $2, $3, $4, $5, $6) WHERE id = $7", age, geoloc, elo, orientation, gender, json.dumps(tag), user['id'])
            
        

if __name__ == "__main__":
    for i in range(10):
        asyncio.run(test_register())
    asyncio.run(randomize())