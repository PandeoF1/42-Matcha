
import asyncio
import requests
import asyncpg
import random
import lorem

TAGS = {
  "#cinema": False,
  "#music": False,
  "#bar": False,
  "#hiking": False,
  "#biking": False,
  "#cooking": False,
  "#photography": False,
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
  "#knitting": False,
  "#crafting": False,
  "#theater": False,
  "#karaoke": False,
  "#camping": False,
  "#beach": False,
  "#concerts": False,
  "#museums": False,
  "#boardgames": False,
  "#puzzles": False,
  "#astronomy": False,
  "#stargazing": False,
  "#fitness": False,
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

gender = "male"
age = "19-25"
number = 1000

async def get_images():
    for i in range(0, number):
    # download image from https://thispersondoesnotexist.com/
        u = requests.get("https://this-person-does-not-exist.com/new?time=1706606983903&gender=%s&age=%s&etnic=all" % (gender, age), headers={"User-Agent": "My User Agent 1.0"})
        r = requests.get("https://this-person-does-not-exist.com" + u.json()["src"], headers={"User-Agent": "My User Agent 1.0"})
        print("image: %s/%s downloaded" % (i, number))
        with open("images/%s.jpg" % i, 'wb') as f:
            f.write(r.content)
#https://randomuser.me/api/?gender=female&results=200
        
async def get_profiles():
    rand = random.randint(0, 1000000)
    male_26_35 = requests.get("https://randomuser.me/api/?gender=%s&results=%s" % (gender, number * 2))
    u = 0
    for i in male_26_35.json()["results"]: # male
        # print(i["name"]["first"], i["name"]["last"], i["email"], "bot%s%s" % (random, u), "Qw@rty123456")
        r = requests.post("https://back-matcha.pandeo.fr/user", json={
            "username": "bot%s%s" % (rand, u),
            "password": "Qw@rty123456",
            "firstName": i["name"]["first"],
            "lastName": i["name"]["last"],
            "email": i["email"]
        })
        # print(r.json())
        if (r.json()["message"] == "Account created successfully, please check your email"):
            u = u + 1
            print ("created: %s/%s" % (u, number), i["name"]["first"], i["name"]["last"], i["email"], "bot%s%s" % (rand, u), "Qw@rty123456")
        if (u == number):
            break

    db = await asyncpg.connect('postgresql://matchadmin:matchapasspas@localhost/matcha')
    await db.execute("UPDATE users SET completion = 1 WHERE completion = 0")
    u = 0
    for i in male_26_35.json()["results"]:
        # login 
        r = requests.post("https://back-matcha.pandeo.fr/user/login", json={
            "username": "bot%s%s" % (rand, u),
            "password": "Qw@rty123456"
        })
        if (r.json()["message"] == "Login Success"):
            # update 
            token = "Bearer " + r.json()["token"]
            # upload images
            image_request = requests.post("https://back-matcha.pandeo.fr/image/upload", files={
                "image": open("images/%s.jpg" % u, "rb")
            }, headers={
                "Authorization": token
            })
            images = []
            if (image_request.json()["message"] == "Image uploaded successfully"):
                print("image uploaded: %s/%s" % (u + 1, number))
                images.append(image_request.json()["url"])
            else:
                print("Error %s/%s %s %s" % (u + 1, number, image_request.json(), token))

            images.append("https://back-matcha.pandeo.fr/image/7033b0af-5467-4cdd-90b2-a39f0ee8b2a2")
            images.append("https://back-matcha.pandeo.fr/image/83ecbdc7-c659-48f7-8be1-c726c919367b")
            bio = lorem.sentence()
            tags = {}
            for tag in TAGS:
                tags[tag] = True if random.randint(0,6) == 5 else False
            orientation = "bisexual" if random.randint(0,1) == 1 else "heterosexual"
            orientation = orientation if random.randint(0,1) == 1 else "homosexual"
            # random geoloc in France
            geoloc = {
                "lat": random.uniform(41.0, 51.0),
                "lon": random.uniform(-5.0, 9.0)
            }
            update = requests.put("https://back-matcha.pandeo.fr/user", json={
                "email": i["email"],
                "lastName": i["name"]["last"],
                "firstName": i["name"]["first"],
                "images": images,
                "bio": bio,
                "tags": tags,
                "age": random.randint(18, 35) if age == "26-35" else random.randint(50, 80),
                "orientation": orientation,
                "gender": gender,
                "geoloc": "%s,%s" % (geoloc["lat"], geoloc["lon"])
            }, headers={
                "Authorization": token
            })
            if (update.json()["message"] == "Your profile has been updated"):
                u = u + 1
                print ("updated: %s/%s" % (u, number), i["name"]["first"], i["name"]["last"], i["email"], "bot%s%s" % (rand, u), "Qw@rty123456", geoloc["lat"], geoloc["lon"])
            else:
                print("Error %s/%s %s" % (u + 1, number, update.json()))
            # u = u + 1
            #print ("updated: %s/200" % u, i["name"]["first"], i["name"]["last"], i["email"], "bot%s%s" % (random, u), "Qw@rty123456")
        if (u == number):
            break

if __name__ == "__main__":
    asyncio.run(get_images())
    asyncio.run(get_profiles())

             #       body["orientation"] != "biseuxal"
             #   and body["orientation"] != "heterosexual"
             #   and body["orientation"] != "homosexual"