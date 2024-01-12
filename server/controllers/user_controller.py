from fastapi import APIRouter, Depends, Request
from database.database import *
from responses.errors.errors_404 import user_not_found
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *

user_controller = APIRouter(prefix="/user", tags=["user"])

@user_controller.post("")
async def register(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    # Check if not connected
    validator = body_validator(data["body"], ["email", "username", "lastName", "firstName", "password"], str)
    if validator is not None:
        return validator
    return await create_user(db, data["body"])

@user_controller.put("")
async def profile(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["email", "lastName", "firstName", "images", "bio", "tags"])
    if validator is not None:
        return validator
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    if user["completion"] == 0:
        return incomplete_profile()
    return await update_user(db, user, data["body"])


@user_controller.get("")
async def get_user(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    return strip_user(user)

@user_controller.post("/login")
async def login(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["username", "password"], str)
    if validator is not None:
        return validator
    return await login_user(db, data["body"])

@user_controller.get("/session")
async def get_session(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if get_token(data["headers"]) is None:
        return empty_token()
    user_id = await check_token(db, get_token(data["headers"]))
    if user_id is None:
        return invalid_token()
    return session(str(user_id))
    
@user_controller.post("/logout")
async def logout(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if get_token(data["headers"]) is None:
        return empty_token()
    user_id = await check_token(db, get_token(data["headers"]))
    if user_id is None:
        return invalid_token()
    return await logout_user(db, get_token(data["headers"]))

@user_controller.get("/{id}")
async def get_specific_user(id, request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_id(db, id)
    if not user:
        return user_not_found()
    return strip_user(user)

@user_controller.post("/{id}/like")
async def like_user(id, request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    origin = await search_user_by_token(db, token)
    if not origin:
        return authentication_required()
    recipient = await search_user_by_id(db, id)
    if not recipient:
        return user_not_found()
    if origin["id"] == recipient["id"]:
        return no_self_interact()
    return await like(db, origin, recipient)

@user_controller.delete("/{id}/like")
async def unlike_user(id, request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    origin = await search_user_by_token(db, token)
    if not origin:
        return authentication_required()
    recipient = await search_user_by_id(db, id)
    if not recipient:
        return user_not_found()
    if origin["id"] == recipient["id"]:
        return no_self_interact()
    return await unlike(db, origin, recipient)
