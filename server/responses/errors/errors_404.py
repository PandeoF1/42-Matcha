from fastapi.responses import JSONResponse
from constants.errors import *


def user_not_found():
    return JSONResponse(status_code=404, content={"message": "User not found"})


def no_profile():
    return JSONResponse(status_code=404, content={"message": "No profile found"})


def image_not_found():
    return JSONResponse(status_code=404, content={"message": "Image not found"})

def no_chat_rooms():
    return JSONResponse(status_code=404, content={"message": "No chat rooms found"})

def room_not_found():
    return JSONResponse(status_code=404, content={"message": "Room not found"})

def message_not_found():
    return JSONResponse(status_code=404, content={"message": "Message not found"})

def message_too_long():
    return JSONResponse(status_code=400, content={"message": "Message too long"})

def message_too_short():
    return JSONResponse(status_code=400, content={"message": "Message too short"})