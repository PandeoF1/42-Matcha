from fastapi.responses import JSONResponse
from constants.errors import *


def account_created():
    return JSONResponse(
        status_code=201,
        content={"message": "Account created successfully, please check your email"},
    )

def like_success():
    return JSONResponse(
        status_code=201,
        content={"message": "You successfully liked this user"},
    )

def image_success(url):
    return JSONResponse(
        status_code=201,
        content={"message": "Image uploaded successfully", "url": url},
    )
