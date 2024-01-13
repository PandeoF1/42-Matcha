import json
import asyncpg
import dotenv
import requests
import pytest
import os
from conftest import str, generate_token

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

image_url = "https://cdn.discordapp.com/attachments/905365556306264105/1195806002755416206/image.png"
image = requests.get(image_url).content

@pytest.mark.order(80)
def test_upload_without_token():
    response = requests.post(
        "https://back-matcha.pandeo.fr/image/upload",
        files={"image": image},
    )
    assert response.status_code == 401
    assert response.json() == {"message": "Authentication is required"}

@pytest.mark.order(80)
def test_upload_empty_image():
    response = requests.post(
        "https://back-matcha.pandeo.fr/image/upload",
        files={"image": ''},
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 422
    assert response.json() == {"message": "The provided image is invalid"}

@pytest.mark.order(80)
def test_upload():
    response = requests.post(
        "https://back-matcha.pandeo.fr/image/upload",
        files={"image": image},
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 201
    assert response.json()['message'] == "Image uploaded successfully"

@pytest.mark.order(80)
def test_get_image():
    response = requests.post(
        "https://back-matcha.pandeo.fr/image/upload",
        files={"image": image},
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 201
    assert response.json()['message'] == "Image uploaded successfully"
    response = requests.get(response.json()['url'])
    assert response.status_code == 200

@pytest.mark.order(80)
def test_get_image_invalid():
    response = requests.get("https://back-matcha.pandeo.fr/image/gfdgdfgfdg")
    assert response.status_code == 404
