from fastapi.responses import JSONResponse
from constants.errors import *


def success_200():
    return JSONResponse(status_code=200, content={"message": "OK"})


def success_200_with_data(data):
    return JSONResponse(status_code=200, content={"message": "OK", "data": data})


def login_success(token):
    return JSONResponse(
        status_code=200, content={"message": "Login Success", "token": token}
    )


def logout_success():
    return JSONResponse(status_code=200, content={"message": "Logout Success"})


def email_validated():
    return JSONResponse(
        status_code=200, content={"message": "Your account has been activated"}
    )


def email_ask_reset_password():
    return JSONResponse(
        status_code=200,
        content={
            "message": "The reset password email will be sent if the email is valid"
        },
    )


def password_reset():
    return JSONResponse(
        status_code=200, content={"message": "Your password has been reset"}
    )


def session(user_id):
    return JSONResponse(
        status_code=200,
        content={"message": "The current session is valid", "user_id": user_id},
    )


def unlike_success():
    return JSONResponse(
        status_code=200,
        content={"message": "You successfully unliked this user", "status": "unlike"},
    )


def update_success():
    return JSONResponse(
        status_code=200, content={"message": "Your profile has been updated"}
    )


def unskip_success():
    return JSONResponse(
        status_code=200,
        content={"message": "You successfully unskipped this user", "status": "unskip"},
    )


def unblock_success():
    return JSONResponse(
        status_code=200,
        content={
            "message": "You successfully unblocked this user",
            "status": "unblock",
        },
    )
