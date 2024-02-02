from fastapi import APIRouter, Depends, Request
from database.database import *
from responses.errors.errors_404 import user_not_found
from services.profiles_service import get_profiles_filtered
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *

profiles_controller = APIRouter(prefix="/profiles", tags=["profiles"])


@profiles_controller.post("/queries")
async def get_profiles(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    if user["completion"] < 2:
        return incomplete_profile()
    validator = body_validator(data["body"], ["min_age", "max_age", "min_elo", "max_elo", "distance", "min_tags", "wanted_tags"], int)
    if validator is not None:
        return validator
    return await get_profiles_filtered(db, user, data["body"])
