import json
import asyncpg
import dotenv
import requests
import pytest
import os
from conftest import str, generate_token

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@pytest.mark.order(3)
def test_ask_reset_password():
    response = requests.post("https://back-matcha.pandeo.fr/email/password/new", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json() == {'message': 'The reset password email will be sent if the email is valid'}

@pytest.mark.order(3)
def test_ask_reset_password_without_token():
    response = requests.post("https://back-matcha.pandeo.fr/email/password/new")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(3)
def test_ask_reset_password_with_random_token():
    response = requests.post("https://back-matcha.pandeo.fr/email/password/new", headers={"authorization": "Bearer _invalid"})
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(3)
def test_reset_password_with_empty_token():
    response = requests.post("https://back-matcha.pandeo.fr/email/password", headers={"authorization": "Bearer "})
    assert response.status_code == 400
    assert response.json() == {'message': 'Missing or invalid body'}

@pytest.mark.order(3)
def test_reset_password_with_invalid_body():
    data = "{"
    response = requests.post("https://back-matcha.pandeo.fr/email/password", data)
    assert response.status_code == 400
    assert response.json() == {'message': 'Missing or invalid body'}

@pytest.mark.order(3)
@pytest.mark.asyncio
async def test_reset_password_wrong_password():
    db = await asyncpg.connect(DATABASE_URL)
    user_id = await db.fetchrow("SELECT user_id FROM token WHERE token = $1", generate_token())
    token = await db.fetchrow("SELECT * FROM email_validation WHERE user_id = $1 AND type = 'password_reset'", user_id['user_id'])
    data = {"password": "Qw@", "token": token['id']}
    response = requests.post("https://back-matcha.pandeo.fr/email/password", json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'Invalid password'}
    await db.close()

@pytest.mark.order(3)
def test_reset_password_with_invalid_type():
    data = {"password": 0}
    response = requests.post("https://back-matcha.pandeo.fr/email/password", json.dumps(data))
    assert response.status_code == 400
    assert response.json() == {'message': "Missing key(s): ['token']"}

@pytest.mark.order(3)
@pytest.mark.asyncio
async def test_reset_password():
    db = await asyncpg.connect(DATABASE_URL)
    user_id = await db.fetchrow("SELECT user_id FROM token WHERE token = $1", generate_token())
    token = await db.fetchrow("SELECT * FROM email_validation WHERE user_id = $1 AND type = 'password_reset'", user_id['user_id'])
    data = {"password": "Qw@rty123456", "token": token['id']}
    response = requests.post("https://back-matcha.pandeo.fr/email/password", json.dumps(data))
    assert response.status_code == 200
    assert response.json() == {'message': 'Your password has been reset'}
    await db.close()