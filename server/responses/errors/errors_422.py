from fastapi.responses import JSONResponse
from constants.errors import *


def invalid_email():
    return JSONResponse(
        status_code=422, content={"message": "The email provided is invalid"}
    )


def invalid_username():
    return JSONResponse(status_code=422, content={"message": "Invalid username"})


def invalid_password():
    return JSONResponse(status_code=422, content={"message": "Invalid password"})


def invalid_last_name():
    return JSONResponse(status_code=422, content={"message": "Invalid last name"})


def invalid_first_name():
    return JSONResponse(status_code=422, content={"message": "Invalid first name"})


def email_not_validated():
    return JSONResponse(
        status_code=422,
        content={"message": "The email was not validated, please check your email"},
    )
