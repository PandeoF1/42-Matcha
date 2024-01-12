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

def already_liked():
    return JSONResponse(
        status_code=401, content={"message": "You already liked this user"}
    )

def user_blocked():
    return JSONResponse(
        status_code=401, content={"message": "You have blocked this user"}
    )

def user_blocked_you():
    return JSONResponse(
        status_code=401, content={"message": "You have been blocked by this user"}
    )

def user_skiped():
    return JSONResponse(
        status_code=401, content={"message": "You already skiped this user"}
    )

def not_liked():
    return JSONResponse(
        status_code=401, content={"message": "You didn't like this user"}
    )

def not_skiped():
    return JSONResponse(
        status_code=401, content={"message": "You didn't skip this user"}
    )