from fastapi import APIRouter, Depends, Request
from database.database import *
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *


session_controller = APIRouter(prefix="/session", tags=["users"])


@session_controller.post("/")
async def login(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    # Check if not connected
    if (data["body"] is None):
        return missing_body()
    if ("authorization" not in data["headers"] or data["headers"]["authorization"].split(" ")[1] is None):
        return await login_user(db, data["body"])
    if not data["headers"]["authorization"].split(" ")[1]:
        return empty_token()
    return await login_user(db, data["body"])

@session_controller.get("/{session_id}")
async def get_session(session_id, request: Request, db=Depends(get_database)):
    print("get session", session_id)

@session_controller.delete("/")
async def logout(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    if ("authorization" not in data["headers"] or data["headers"]["authorization"].split(" ")[1] is None):
        return empty_token()
    return await logout_user(db, data["headers"]["authorization"].split(" ")[1])