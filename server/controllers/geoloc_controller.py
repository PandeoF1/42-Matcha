from fastapi import APIRouter, Depends, Request
from database.database import *
from responses.errors.errors_404 import user_not_found
from services.profiles_service import get_profiles_filtered
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *
import httpx
import geopy.distance

geoloc_controller = APIRouter(prefix="/geoloc", tags=["geoloc"])


@geoloc_controller.get("")
async def get_geoloc(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    try:
        client_ip = request.client.host
        async with httpx.AsyncClient() as client:
            ip = await client.get(f"http://ip-api.com/json/{client_ip}")
        loc = ip.json()
    except Exception:
        return {"lat": 0, "lng": 0}
    if loc["status"] == "fail":
        loc = {"lat": 0, "lon": 0}
    return {"lat": loc["lat"], "lng": loc["lon"]}

@geoloc_controller.get("/all")
async def get_geoloc(request: Request, db=Depends(get_database)):
    users = await db.fetch("SELECT * FROM users")
    _user = await search_user_by_token(db, get_token(request.headers))
    geoloc = []
    for user in users:
        data = {}
        data["firstName"] = user["first_name"]
        data["lastName"] = user["last_name"]
        data["id"] = user["id"]
        data["geoloc"] = user["geoloc"]
        data["image"] = user["images"][0] if user["images"] is not None and len(user["images"]) > 0 else ""
        data["elo"] = user["elo"]
        distance = geopy.distance.distance(user["geoloc"], _user["geoloc"]).km
        if distance < 50:
            data["icon"] = "https://cdn.discordapp.com/attachments/1117526565258010745/1202237628653510686/zQ2iHlRAAAASElEQVR4nO3BMQEAAADCoPVPbQlPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBsXcAAGLPH6gAAAAAElFTkSuQmCC.png"
        else:
            data["icon"] = "https://cdn.discordapp.com/attachments/1117526565258010745/1202237654603935805/pngbase64iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX5AwOvS3f8AAAASElEQVR4nO3BgQAAAADDoPlTXAIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC.png"
        geoloc.append(data)
    return geoloc

@geoloc_controller.get("/all/{_distance}")
async def get_geoloc(_distance, request: Request, db=Depends(get_database)):
    users = await db.fetch("SELECT * FROM users")
    _user = await search_user_by_token(db, get_token(request.headers))
    geoloc = []
    for user in users:
        data = {}
        data["firstName"] = user["first_name"]
        data["lastName"] = user["last_name"]
        data["id"] = user["id"]
        data["geoloc"] = user["geoloc"]
        data["image"] = user["images"][0] if user["images"] is not None and len(user["images"]) > 0 else ""
        data["elo"] = user["elo"]
        distance = geopy.distance.distance(user["geoloc"], _user["geoloc"]).km
        if distance < int(_distance):
            data["icon"] = "https://cdn.discordapp.com/attachments/1117526565258010745/1202237628653510686/zQ2iHlRAAAASElEQVR4nO3BMQEAAADCoPVPbQlPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBsXcAAGLPH6gAAAAAElFTkSuQmCC.png"
        else:
            data["icon"] = "https://cdn.discordapp.com/attachments/1117526565258010745/1202237654603935805/pngbase64iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX5AwOvS3f8AAAASElEQVR4nO3BgQAAAADDoPlTXAIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC.png"
        geoloc.append(data)
    return geoloc
