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
        "geoloc": user["geoloc"],
        "elo": user["elo"]
    }


async def get_profiles_filtered(db, user, _filter):
    if (_filter["min_age"] > _filter["max_age"]):
        return invalid_age()
    if (_filter["min_elo"] > _filter["max_elo"]):
        return invalid_elo()
    if (_filter["min_tags"] < 0 or _filter["min_tags"] > 20):
        return invalid_tags()
    if (_filter["min_elo"] < 0 or _filter["min_elo"] > 1000 or _filter["max_elo"] < 0 or _filter["max_elo"] > 1000):
        return invalid_elo()
    if (_filter["min_age"] < 18 or _filter["min_age"] > 100 or _filter["max_age"] < 18 or _filter["max_age"] > 99):
        return invalid_age()
    if (_filter["distance"] > 200 or _filter["distance"] < 5):
        return invalid_distance()

    # elo <- tags <- distance 
    result = await db.fetch(
        "SELECT * FROM users WHERE id != $1 AND completion = $2 AND age >= $3 AND age <= $4 AND elo >= $5 AND elo <= $6",
        user["id"],
        2,
        _filter["min_age"],
        _filter["max_age"],
        _filter["min_elo"],
        _filter["max_elo"],
    )
    blacklist = await db.fetch(
        "SELECT * FROM interactions WHERE (origin = $1) AND (type = 'like' OR type = 'skip' OR type = 'block')",
        user["id"],
    )
    striped = []
    for i in result:
        # check distance between two geoloc
        if (
            geopy.distance.distance(user["geoloc"], i["geoloc"]).km
            <= _filter["distance"]
        ):
            # if bisexual
            avoid = False
            for j in blacklist:
                if j["type"] == "block" and i["id"] == j["origin"] or i["id"] == j["origin"] or i["id"] == j["recipient"]:
                    avoid = True
            # check common tags
            common_tags = set()
            for k in json.loads(user["tags"]).keys():
                if json.loads(user["tags"])[k] == True and json.loads(i["tags"])[k] == True:
                    common_tags.add(k)
            if avoid == False and len(common_tags) >= _filter["min_tags"]:
                _tmp = await strip_profile(dict(i))
                _tmp["common_tags"] = common_tags
                _tmp["common_tags_number"] = len(common_tags)
                if user["orientation"] == "bisexual":
                    striped.append(_tmp)
                elif user["orientation"] == "homosexual" and user["gender"] == i["gender"]:
                    striped.append(_tmp)
                elif (
                    user["orientation"] == "heterosexual" and user["gender"] != i["gender"]
                ):
                    striped.append(_tmp)
        if len(striped) >= 20:
            break
    # remove key geoloc and username
    for i in striped:
        i["distance"] = geopy.distance.distance(user["geoloc"], i["geoloc"]).km
        i.pop("geoloc")
        i.pop("username")
        i.pop("lastName")
        i.pop("tags")
        if (i["distance"] <= 1):
            i["distance"] = 1

    # sort in first by elo, then by tags, then by distance
    striped.sort(key=lambda x: x["elo"], reverse=True)
    striped.sort(key=lambda x: x["common_tags_number"], reverse=True)
    striped.sort(key=lambda x: x["distance"], reverse=False)

    # add distance to each profile

    # for i in result:
    # check distance between two geoloc
    # print("%skm, %s %s %s %s %s %s" % (geopy.distance.distance(user["geoloc"], i["geoloc"]).km, user["gender"], i["gender"], user["orientation"], i["orientation"], user["age"], i["age"]))
    
    if len(striped) == 0:
        return no_profile()
    return {"count": len(striped), "profiles": striped}
