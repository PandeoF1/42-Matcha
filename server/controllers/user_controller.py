from fastapi import APIRouter, Depends, Request
import geopy
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
    validator = body_validator(
        data["body"], ["email", "username", "lastName", "firstName", "password"], str
    )
    if validator is not None:
        return validator
    return await create_user(db, data["body"])


@user_controller.put("")
async def profile(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(
        data["body"],
        [
            "email",
            "lastName",
            "firstName",
            "images",
            "bio",
            "tags",
            "orientation",
            "gender",
            "geoloc"
        ],
    )
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

@user_controller.get("/views")
async def get_views(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()

    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    return await get_views_by_user(db, user)

@user_controller.get("/likes")
async def get_likes(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()

    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    return await get_likes_by_user(db, user)

@user_controller.get("/{id}")
async def get_specific_user(id, request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    me = await search_user_by_token(db, token)
    if not me:
        return authentication_required()
    user = await search_user_by_id(db, id)
    if not user:
        return user_not_found()
    striped_user = strip_user(user)
    striped_user.pop("username")
    striped_user.pop("email")
    striped_user.pop("geoloc")
    striped_user.pop("lastName")
    striped_user.pop("completion")
    striped_user["liked"] = await is_liked(db, me, user)
    striped_user["skipped"] = await is_skipped(db, me, user)
    striped_user["blocked"] = await is_blocked(db, me, user)
    # if match
    if await is_liked(db, user, me) and await is_liked(db, me, user):
        striped_user["matched"] = True
    else:
        striped_user["matched"] = False
    striped_user["distance"] = geopy.distance.distance(me["geoloc"], user["geoloc"]).km if geopy.distance.distance(me["geoloc"], user["geoloc"]).km > 1 else 1
    striped_user["commonTags"] = []
    striped_user["last_login"] = user["last_activity"]
    me_tags = json.loads(me["tags"])
    user_tags = json.loads(user["tags"])
    for tag in me_tags:
        if me_tags[tag] and user_tags[tag]:
            striped_user["commonTags"].append(tag)
    if await is_viewed(db, me, user) is False:
        await view(db, me, user)
    return striped_user


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


@user_controller.post("/{id}/skip")
async def skip_user(id, request: Request, db=Depends(get_database)):
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
    return await skip(db, origin, recipient)


@user_controller.delete("/{id}/skip")
async def unskip_user(id, request: Request, db=Depends(get_database)):
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
    return await unskip(db, origin, recipient)


@user_controller.post("/{id}/block")
async def block_user(id, request: Request, db=Depends(get_database)):
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
    return await block(db, origin, recipient)


@user_controller.delete("/{id}/block")
async def unblock_user(id, request: Request, db=Depends(get_database)):
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
    return await unblock(db, origin, recipient)


@user_controller.post("/{id}/report")
async def report_user(id, request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    validator = body_validator(data["body"], ["message"], str)
    if validator is not None:
        return validator
    origin = await search_user_by_token(db, token)
    if not origin:
        return authentication_required()
    recipient = await search_user_by_id(db, id)
    if not recipient:
        return user_not_found()
    if origin["id"] == recipient["id"]:
        return no_self_interact()
    return await report(db, origin, recipient, data["body"])
