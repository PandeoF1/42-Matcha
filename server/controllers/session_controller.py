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
    # Check if not connected
    if data["body"] is None:
        return missing_body()
    return await login_user(db, data["body"])


@session_controller.get("")
async def get_session(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if (
        "authorization" not in data["headers"]
        or data["headers"]["authorization"].split(" ")[1] is None
    ):
        return empty_token()
    user_id = await check_token(db, data["headers"]["authorization"].split(" ")[1])
    print("user_id", user_id, data["headers"]["authorization"].split(" ")[1])
    if user_id is None:
        return invalid_token()
    return session({"user_id": str(user_id)})
    


@session_controller.delete("")
async def logout(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if (
        "authorization" not in data["headers"]
        or data["headers"]["authorization"].split(" ")[1] is None
    ):
        return empty_token()
    return await logout_user(db, data["headers"]["authorization"].split(" ")[1])
