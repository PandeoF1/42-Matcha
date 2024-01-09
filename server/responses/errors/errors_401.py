from fastapi.responses import JSONResponse
from constants.errors import *

def invalid_token():
    return JSONResponse(
        status_code=401,
        content={
            "error": {
                "message": "The token provided is invalid"
            }
        }
    )

def empty_token():
    return JSONResponse(
        status_code=401,
        content={
            "error": {
                "message": "Authentication is required"
            }
        }
    )

