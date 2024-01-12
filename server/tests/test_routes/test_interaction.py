import json
import asyncpg
import dotenv
import requests
import pytest
import os
from conftest import str, generate_token, generate_id

_id = None

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


@pytest.mark.order(5)
@pytest.mark.asyncio
async def test_like_user():
    global _id
    id = await generate_id()
    _id = id
    response = requests.post(
        f"https://back-matcha.pandeo.fr/user/{id}/like",
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 201
    assert response.json() == {
        "message": "You successfully liked this user",
        "status": "like",
    }


@pytest.mark.order(5)
def test_like_user_without_token():
    response = requests.post(f"https://back-matcha.pandeo.fr/user/{_id}/like")
    assert response.status_code == 401
    assert response.json() == {"message": "Authentication is required"}


@pytest.mark.order(5)
def test_like_user_already_liked():
    response = requests.post(
        f"https://back-matcha.pandeo.fr/user/{_id}/like",
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 401
    assert response.json() == {"message": "You already liked this user"}


@pytest.mark.order(5)
def test_skip_user_already_liked():
    response = requests.post(
        f"https://back-matcha.pandeo.fr/user/{_id}/skip",
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    print(response.json())
    assert response.status_code == 401
    assert response.json() == {"message": "You already liked this user"}
