from fastapi import APIRouter, Depends, Request
from database.database import *
from responses.errors.errors_404 import user_not_found
from services.profiles_service import get_profiles_unfiltered
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *
import httpx

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
