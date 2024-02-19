#!/usr/bin/env python3
from fastapi import Depends, FastAPI, Request, WebSocket, WebSocketDisconnect
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_controller
from controllers.profiles_controller import profiles_controller
from controllers.email_controller import email_controller
from controllers.image_controller import image_controller
from controllers.geoloc_controller import geoloc_controller
from controllers.notifications_controller import notifications_controller
from controllers.chat_controller import chat_controller
from controllers.status_controller import status_controller
from controllers.tags_controller import tags_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://back-matcha.pandeo.fr",
        "https://front-matcha.pandeo.fr",
        "https://front-matcha.pandeo.fr/",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT"],
    allow_headers=["Authorization", "Content-Type", "Access-Control-Allow-Origin"],
)

@app.get("/")
async def root():
    return {"status": "ok"}

app.include_router(user_controller)
app.include_router(email_controller)
app.include_router(profiles_controller)
app.include_router(image_controller)
app.include_router(geoloc_controller)
app.include_router(notifications_controller)
app.include_router(chat_controller)
app.include_router(status_controller)
app.include_router(tags_controller)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)