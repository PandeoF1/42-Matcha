from fastapi.responses import JSONResponse
from constants.errors import *


def account_created():
    return JSONResponse(
        status_code=200,
        content={"message": "Account created successfully, please check your email"},
    )
