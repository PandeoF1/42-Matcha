from fastapi.responses import JSONResponse
from constants.errors import *

def user_not_found():
    return JSONResponse(
        status_code=404, content={"message": "User not found"}
    )