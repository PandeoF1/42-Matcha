import json
import requests
import pytest
import asyncpg
import os
import dotenv
from conftest import generate_token, str

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@pytest.mark.order(2)
def test_login_user_not_validated():
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/session",json.dumps(data))
    print(response.json())
    assert response.status_code == 422
    assert response.json() == {'message': 'The email was not validated, please check your email'}

@pytest.mark.order(2)
def test_login_user_invalid_username():
    data = {"username":"_invalid","password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/session",json.dumps(data))
    print(response.json())
    assert response.status_code == 401

@pytest.mark.order(2)
def test_login_user_not_exist():
    data = {"username":"oui%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/session",json.dumps(data))
    print(response.json())
    assert response.status_code == 401
    
@pytest.mark.order(2)
@pytest.mark.asyncio
async def test_login_user():
    db = await asyncpg.connect(DATABASE_URL)
    await db.execute("UPDATE users SET completion = 1 WHERE username = $1", str)
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/session",json.dumps(data))
    assert response.status_code == 200
    assert response.json()['message'] == 'Login Success'
    assert response.json()['token'] is not None

@pytest.mark.order(2)
def test_get_session_without_token():
    response = requests.get("https://back-matcha.pandeo.fr/session")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(2)
def test_get_session_invalid_token():
    response = requests.get("https://back-matcha.pandeo.fr/session", headers={"authorization": "Bearer invalid_token"})
    assert response.status_code == 401
    assert response.json() == {'message': 'The token provided is invalid'}

@pytest.mark.order(2)
def test_get_session():
    response = requests.get("https://back-matcha.pandeo.fr/session", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json()['message'] == 'The current session is valid'

@pytest.mark.order(4)
def test_logout_without_token():
    response = requests.delete("https://back-matcha.pandeo.fr/session")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(4)
def test_logout():
    response = requests.delete("https://back-matcha.pandeo.fr/session", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json() == {'message': 'Logout Success'}
