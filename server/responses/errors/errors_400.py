from fastapi.responses import JSONResponse
from constants.errors import *


def missing_body():
    return JSONResponse(status_code=400, content={"message": "Missing body or invalid body"})


def missing_keys(awaited_keys: list, received_keys: dict):
    response = []
    for key in awaited_keys:
        if key not in received_keys:
            response.append(key)
    if len(response):
        return JSONResponse(
            status_code=400, content={"message": f"Missing key(s): {response}"}
        )
    return None


def empty_keys(received_keys: dict):
    response = []
    try:
        for key in received_keys:
            if not len(received_keys[key]):
                response.append(key)
        if len(response):
            return JSONResponse(
                status_code=400, content={"message": f"Empty key(s): {response}"}
            )
    except Exception:
        return JSONResponse(status_code=400, content={"message": "Empty key(s)"})
    return None
