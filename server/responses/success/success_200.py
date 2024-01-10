from fastapi.responses import JSONResponse
from constants.errors import *


def success_200():
    return JSONResponse(status_code=200, content={"message": "OK"})


def success_200_with_data(data):
    return JSONResponse(status_code=200, content={"message": "OK", "data": data})


def login_success(data):
    return JSONResponse(
        status_code=200, content={"message": "Login Success", "data": data}
    )

def logout_success():
    return JSONResponse(status_code=200, content={"message": "Logout Success"})

def email_validated():
    return JSONResponse(
        status_code=200, content={"message": "Your account has been activated"}
    )

def email_ask_reset_password():
    return JSONResponse(
        status_code=200, content={"message": "The reset password email will be sent if the email is valid"}
    )

def password_reset():
    return JSONResponse(
        status_code=200, content={"message": "Your password has been reset"}
    )

def session(data):
    return JSONResponse(
        status_code=200, content={"message": "Session is valid", "data": data}
    )