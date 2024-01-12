import string
from fastapi.responses import JSONResponse
from constants.errors import *
from responses.errors.errors_401 import empty_token


def missing_body():
    return JSONResponse(status_code=400, content={"message": "Missing or invalid body"})


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


def type_keys(received_keys, type=str):
    response = []
    for key in received_keys:
        if (
            not isinstance(received_keys[key], type)
            and key != "images"
            and key != "tags"
            and key != "age"
        ):
            response.append(key)
        if key == "images":
            for image in received_keys[key]:
                if not isinstance(image, str):
                    response.append(key)
        if key == "tags":
            if not isinstance(received_keys[key], object):
                response.append(key)
        if key == "age":
            if not isinstance(received_keys[key], int):
                response.append(key)
    if len(response):
        return JSONResponse(
            status_code=400, content={"message": f"Wrong type key(s): {response}"}
        )
    return None


def empty_keys(received_keys: dict):
    response = []
    try:
        for key in received_keys:
            if key != "age" and not len(received_keys[key]):
                response.append(key)
        if len(response):
            return JSONResponse(
                status_code=400, content={"message": f"Empty key(s): {response}"}
            )
    except Exception:
        return JSONResponse(status_code=400, content={"message": "Empty key(s)"})
    return None


def body_validator(body, keys, type=str):
    if body is None:
        return missing_body()
    if missing_keys(keys, body):
        return missing_keys(keys, body)
    if type_keys(body, type):
        return type_keys(body, type)
    if empty_keys(body):
        return empty_keys(body)
    return None


def header_validator(headers):
    if headers is None:
        return empty_token()
    if missing_keys(["authorization"], headers):
        return empty_token()
    if headers["authorization"].split(" ")[0] != "Bearer":
        return empty_token()
    if len(headers["authorization"].split(" ")) != 2:
        return empty_token()
    return None


def image_invalid():
    return JSONResponse(
        status_code=422, content={"message": "The provided image is invalid"}
    )


def too_many_images():
    return JSONResponse(
        status_code=422, content={"message": "You can only upload 5 images"}
    )
