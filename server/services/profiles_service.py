
import json
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
from responses.errors.errors_404 import no_profile
from services.user_service import strip_user
import geopy.distance

async def strip_profile(user):
    if not user:
        return None
    return {
        "id": user["id"],
        "username": user["username"],
        "firstName": user["first_name"],
        "lastName": user["last_name"],
        "images": user["images"],
        "gender": user["gender"],
        "orientation": user["orientation"],
        "tags": json.loads(user["tags"]),
        "bio": user["bio"] if user["bio"] else "",
        "age": user["age"],
        "geoloc": user["geoloc"]
    }


async def get_profiles_unfiltered(db, user):
    filter = {'completion': 2, 'age': 10, 'distance': 50, 'elo_min': 0}
    result = await db.fetch("SELECT * FROM users WHERE id != $1 AND completion = $2 AND age >= $3 AND age <= $4 AND elo >= $5", user["id"], filter["completion"], int(user["age"]) - filter["age"], int(user["age"]) + filter["age"], filter["elo_min"])
    blacklist = await db.fetch("SELECT * FROM interactions WHERE (origin = $1) AND (type = 'like' OR type = 'skip' OR type = 'block')", user["id"])
    striped = []
    for i in result:
        # check distance between two geoloc
        if geopy.distance.distance(user["geoloc"], i["geoloc"]).km <= filter["distance"]:
            # if bisexual
            if user["orientation"] == "bisexual":
                striped.append(await strip_profile(dict(i)))
            elif user["orientation"] == "homosexual" and user["gender"] == i["gender"]:
                striped.append(await strip_profile(dict(i)))
            elif user["orientation"] == "heterosexual" and user["gender"] != i["gender"]:
                striped.append(await strip_profile(dict(i)))
            
        for j in blacklist:
            if i['type'] == 'block' and i["id"] == j["origin"]:
                striped.pop()
            elif i["id"] == j["origin"] or i["id"] == j["recipient"]:
                striped.pop()
        if len(striped) >= 20:
            break
    # sort by age and distance
    striped.sort(key=lambda x: (x["age"], geopy.distance.distance(user["geoloc"], x["geoloc"]).km))
    #for i in result:
        # check distance between two geoloc
        #print("%skm, %s %s %s %s %s %s" % (geopy.distance.distance(user["geoloc"], i["geoloc"]).km, user["gender"], i["gender"], user["orientation"], i["orientation"], user["age"], i["age"]))
    return {'count': len(striped), 'profiles': striped}