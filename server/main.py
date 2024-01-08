#!/usr/bin/env python3
from fastapi import FastAPI, Query, Path, Depends
from typing import Annotated
import uvicorn
import requests
from requests.auth import HTTPBasicAuth
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware 
from decouple import config

from database import get_database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://back-matcha.pandeo.fr/", "https://front-matcha.pandeo.fr/"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.get("/")
async def root(db = Depends(get_database)):
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)