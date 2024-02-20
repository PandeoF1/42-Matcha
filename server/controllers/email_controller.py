from fastapi import APIRouter, Depends, Request
from pydantic import Json
from database.database import *
from responses.errors.errors_401 import authentication_required
from responses.success.success_200 import email_ask_reset_password
from services.user_service import (
    ask_reset_password,
    get_token,
    search_user_by_email,
    search_user_by_token,
    validate_email,
    change_password,
)
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *

email_controller = APIRouter(prefix="/email", tags=["email"])


@email_controller.post("/confirm")
async def confirm(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["token"], str)
    if validator is not None:
        return validator
    return await validate_email(db, data["body"])


@email_controller.post("/password/new")
async def password(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["email"], str)
    if validator is not None:
        return validator
    user = await search_user_by_email(db, data["body"]["email"])
    if not user:
        return email_ask_reset_password()
    return await ask_reset_password(db, user)


@email_controller.post("/password")
async def reset_password(request: Request, db=Depends(get_database)):
    data = await parse_request(request)
    validator = body_validator(data["body"], ["token", "password"], str)
    if validator is not None:
        return validator
    return await change_password(db, data["body"])
