#!/usr/bin/env python3
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://back-matcha.pandeo.fr/", "https://front-matcha.pandeo.fr/"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(user_controller)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)
