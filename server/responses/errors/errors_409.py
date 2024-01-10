from fastapi.responses import JSONResponse
from constants.errors import *


def email_already_exists():
    return JSONResponse(status_code=400, content={"message": "Email already exists"})


def username_already_exists():
    return JSONResponse(status_code=400, content={"message": "Username already exists"})
