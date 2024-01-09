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

def account_created_200(data):
    return JSONResponse(
        status_code=200,
        content={
            "message": "Account created successfully",
            "data": data
        }
    )
