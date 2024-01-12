from fastapi.responses import JSONResponse
from constants.errors import *

def invalid_token():
    return JSONResponse(
        status_code=401, content={"message": "The token provided is invalid"}
    )

def invalid_email_token():
    return JSONResponse(
        status_code=401, content={"message": "The email token provided is invalid"}
    )

def empty_token():
    return JSONResponse(
        status_code=401, content={"message": "Authentication is required"}
    )

def invalid_username_or_password():
    return JSONResponse(
        status_code=401, content={"message": "Invalid username or password"}
    )

def authentication_required():
    return JSONResponse(
        status_code=401, content={"message": "Authentication is required"}
    )

def incomplete_profile():
    return JSONResponse(
        status_code=401, content={"message": "Your profile is incomplete"}
    )

def no_self_interact():
    return JSONResponse(
        status_code=401, content={"message": "You can't interact with yourself"}
    )
