from fastapi import APIRouter, Depends, Request
from database.database import *
from services.user_service import *
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *


user_controller = APIRouter(prefix="/user", tags=["user"])


@user_controller.post("")
async def register(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    # Check if not connected
    if data["body"] is None:
        return missing_body()
    if ("authorization" not in data["headers"] or len(data["headers"]["authorization"].split(" ")) < 2
        or data["headers"]["authorization"].split(" ")[1] is None
    ):
        return await create_user(db, data["body"])
    if not data["headers"]["authorization"].split(" ")[1]:
        return empty_token()
    return await create_user(db, data["body"])

@user_controller.put("")
async def update_user(request: Request, db=Depends(get_database)):
    print("update user")

@user_controller.get("")
async def get_user(request: Request, db=Depends(get_database)):
    print("get user")

@user_controller.get("/{id}")
async def get_specific_user(id, request: Request, db=Depends(get_database)):
    print("get user specific", id)
