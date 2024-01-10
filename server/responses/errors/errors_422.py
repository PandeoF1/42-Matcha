from fastapi.responses import JSONResponse
from constants.errors import *


def password_too_short():
    return JSONResponse(status_code=422, content={"message": "Password too short"})


def password_too_long():
    return JSONResponse(status_code=422, content={"message": "Password too long"})


def password_no_number():
    return JSONResponse(
        status_code=422,
        content={"message": "Password must contain at least one number"},
    )


def password_no_upper():
    return JSONResponse(
        status_code=422,
        content={"message": "Password must contain at least one uppercase letter"},
    )


def password_no_lower():
    return JSONResponse(
        status_code=422,
        content={"message": "Password must contain at least one lowercase letter"},
    )


def password_no_special():
    return JSONResponse(
        status_code=422,
        content={"message": "Password must contain at least one special character"},
    )


def invalid_email():
    return JSONResponse(status_code=422, content={"message": "The email provided is invalid"})


def invalid_username():
    return JSONResponse(status_code=422, content={"message": "Invalid username"})


def username_too_short():
    return JSONResponse(status_code=422, content={"message": "Username too short"})


def username_too_long():
    return JSONResponse(status_code=422, content={"message": "Username too long"})


def username_not_alphanumeric():
    return JSONResponse(
        status_code=422, content={"message": "Username must be alphanumeric"}
    )


def first_name_not_alphanumeric():
    return JSONResponse(
        status_code=422, content={"message": "First Name must be alphanumeric"}
    )


def last_name_not_alphanumeric():
    return JSONResponse(
        status_code=422, content={"message": "Last Name must be alphanumeric"}
    )


def first_name_too_short():
    return JSONResponse(status_code=422, content={"message": "First Name too short"})


def first_name_too_long():
    return JSONResponse(status_code=422, content={"message": "First Name too long"})


def last_name_too_short():
    return JSONResponse(status_code=422, content={"message": "Last Name too short"})


def last_name_too_long():
    return JSONResponse(status_code=422, content={"message": "Last Name too long"})
