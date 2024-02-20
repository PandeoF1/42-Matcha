import json
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
from responses.errors.errors_404 import no_profile
from constants.tags import TAGS
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
    if (_filter["distance"] > 200 or _filter["distance"] < 1):
        return invalid_distance()
    for tag in _filter["wanted_tags"]:
        if (tag not in TAGS):
            return invalid_tags()
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
                _tmp["commonTags"] = common_tags
                _tmp["common_tags_number"] = len(common_tags)
                if user["orientation"] == "bisexual":
                    striped.append(_tmp)
                elif user["orientation"] == "homosexual" and user["gender"] == i["gender"]:
                    striped.append(_tmp)
                elif (
                    user["orientation"] == "heterosexual" and user["gender"] != i["gender"]
                ):
                    striped.append(_tmp)
        if len(striped) >= 50:
            break
    # remove key geoloc and username
    new_list = []
    for i in striped:
        good = False
        _common_tags = []
        for tag in _filter["wanted_tags"]:
            if tag in i["tags"] and i["tags"][tag]:
                _common_tags.append(tag)
            
        if len(_common_tags) == len(_filter["wanted_tags"]):
            good = True
        if (good or len(_filter["wanted_tags"]) == 0):
            new_list.append({
            'id': i['id'],
            'distance': geopy.distance.distance(user["geoloc"], i["geoloc"]).km,
            'commonTags': i['commonTags'],
            'age': i['age'],
            'elo': i['elo'],
            'image': i['images'][0] if len(i['images']) else None,
            })
    if len(new_list) == 0:
        return no_profile()
    return {"count": len(new_list), "profiles": new_list}
