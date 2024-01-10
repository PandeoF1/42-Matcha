from fastapi import APIRouter, Depends, Request
from database.database import *
from services.user_service import *
from services.session_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *


session_controller = APIRouter(prefix="/session", tags=["session"])


@session_controller.post("")
async def login(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["username", "password"], str)
    if validator is not None:
        return validator
    return await login_user(db, data["body"])


@session_controller.get("")
async def get_session(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if get_token(data["headers"]) is None:
        return empty_token()
    user_id = await check_token(db, data["headers"]["authorization"].split(" ")[1])
    if user_id is None:
        return invalid_token()
    return session(str(user_id))
    


@session_controller.delete("")
async def logout(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if get_token(data["headers"]) is None:
        return empty_token()
    return await logout_user(db, data["headers"]["authorization"].split(" ")[1])
