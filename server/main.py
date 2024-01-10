#!/usr/bin/env python3
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_controller
from controllers.email_controller import email_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://back-matcha.pandeo.fr", "https://front-matcha.pandeo.fr", "https://front-matcha.pandeo.fr/"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT"],
    allow_headers=["Authorization", "Content-Type", "Access-Control-Allow-Origin"],
)


@app.get("/")
async def root():
    return {"status": "ok"}


app.include_router(user_controller)
app.include_router(email_controller)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)
