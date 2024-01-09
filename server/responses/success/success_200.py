from fastapi.responses import JSONResponse
from constants.errors import *

def success_200():
    return JSONResponse(
        status_code=200,
        content={
            "message": "OK"
        }
    )

def success_200_with_data(data):
    return JSONResponse(
        status_code=200,
        content={
            "message": "OK",
            "data": data
        }
    )

def login_success(data):
    return JSONResponse(
        status_code=200,
        content={
            "message": "Login Success",
            "data": data
        }
    )

def logout_success():
    return JSONResponse(
        status_code=200,
        content={
            "message": "Logout Success"
        }
    )