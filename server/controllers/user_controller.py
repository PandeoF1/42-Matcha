from fastapi import APIRouter, Depends, Request
from database.database import *
from services.session_service import get_token, search_user_by_token
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
async def update_user(request: Request, db=Depends(get_database)):
    print("update user")

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

@user_controller.get("/{id}")
async def get_specific_user(id, request: Request, db=Depends(get_database)):
    print("get user specific", id)
