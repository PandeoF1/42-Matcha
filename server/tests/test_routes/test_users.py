import json
import random
import string
import asyncpg
import pytest
import requests
import os
import dotenv
from conftest import str, generate_token

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@pytest.mark.order(1)
def test_create_user():
    data = {"username":"%s" % str,"email":"%s@nofoobar.com" % str,"password":"Qw@rty123456", "firstName":"test", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 201

@pytest.mark.order(1)
def test_create_user_already_exists():
    data = {"username":"%s" % str,"email":"%s@nofoobar.com" % str,"password":"Qw@rty123456", "firstName":"test", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 400
    assert response.json() == {'message': 'Email already exists'}

@pytest.mark.order(1)
def test_create_user_invalid_email():
    data = {"username":"%s" % str,"email":"_invalid","password":"Qw@rty123456", "firstName":"test", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'The email provided is invalid'}

@pytest.mark.order(1)
def test_create_user_invalid_password():
    data = {"username":"%s" % str,"email":"%s" % str,"password":"_invalid", "firstName":"test", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'Invalid password'}

@pytest.mark.order(1)
def test_create_user_invalid_username():
    data = {"username":"_invalid","email":"%s" % str,"password":"Qw@rty123456", "firstName":"test", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'Invalid username'}

@pytest.mark.order(1)
def test_create_user_invalid_lastname():
    data = {"username":"%s" % str,"email":"%s" % str,"password":"Qw@rty123456", "firstName":"test", "lastName":"_invalid"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'Invalid last name'}

@pytest.mark.order(1)
def test_create_user_invalid_firstname():
    data = {"username":"%s" % str,"email":"%s" % str,"password":"Qw@rty123456", "firstName":"_invalid", "lastName":"test"}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 422
    assert response.json() == {'message': 'Invalid first name'}

@pytest.mark.order(1)
def test_create_user_invalid_body():
    data = "{"
    response = requests.post("https://back-matcha.pandeo.fr/user",data)
    assert response.status_code == 400
    assert response.json() == {'message': 'Missing or invalid body'}

@pytest.mark.order(1)
def test_create_user_invalid_type():
    data = {"username": ["%s" % str],"email": ["%s" % str],"password": 0, "firstName": 0, "lastName": {}}
    response = requests.post("https://back-matcha.pandeo.fr/user",json.dumps(data))
    assert response.status_code == 400
    assert response.json() == {'message': "Wrong type key(s): ['username', 'email', 'password', 'firstName', 'lastName']"}

@pytest.mark.order(2)
def test_login_user_not_validated():
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    print(response.json())
    assert response.status_code == 422
    assert response.json() == {'message': 'The email was not validated, please check your email'}

@pytest.mark.order(2)
def test_login_user_invalid_username():
    data = {"username":"_invalid","password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    print(response.json())
    assert response.status_code == 401

@pytest.mark.order(2)
def test_login_user_not_exist():
    data = {"username":"oui%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    print(response.json())
    assert response.status_code == 401

@pytest.mark.order(2)
@pytest.mark.asyncio
async def test_login_user():
    db = await asyncpg.connect(DATABASE_URL)
    await db.execute("UPDATE users SET completion = 1 WHERE username = $1", str)
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    assert response.status_code == 200
    assert response.json()['message'] == 'Login Success'
    assert response.json()['token'] is not None
    await db.close()

@pytest.mark.order(2)
def test_get_session_without_token():
    response = requests.get("https://back-matcha.pandeo.fr/user/session")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(2)
def test_get_session_invalid_token():
    response = requests.get("https://back-matcha.pandeo.fr/user/session", headers={"authorization": "Bearer invalid_token"})
    assert response.status_code == 401
    assert response.json() == {'message': 'The token provided is invalid'}

@pytest.mark.order(2)
def test_get_session():
    response = requests.get("https://back-matcha.pandeo.fr/user/session", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json()['message'] == 'The current session is valid'

@pytest.mark.order(2)
def test_get_user():
    response = requests.get("https://back-matcha.pandeo.fr/user/session", headers={"authorization": "Bearer %s" % generate_token()})
    print(response.json(), generate_token())
    assert response.status_code == 200

@pytest.mark.order(2)
def test_get_specific_user_without_token():
    response = requests.get("https://back-matcha.pandeo.fr/user/1")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(2)
def test_get_specific_user_random_id():
    response = requests.get("https://back-matcha.pandeo.fr/user/99", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 404
    assert response.json() == {'message': 'User not found'}

@pytest.mark.order(2)
@pytest.mark.asyncio
async def test_get_specific_user():
    db = await asyncpg.connect(DATABASE_URL)
    user_id = await db.fetchrow("SELECT id FROM users WHERE username = $1", str)
    response = requests.get("https://back-matcha.pandeo.fr/user/%s" % user_id['id'], headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200

@pytest.mark.order(4)
def test_update_profile_without_token():
    data = {"email": "%s@nofoobar.com" % str, "lastName": "Theo", "firstName": "Nard", "images": ["https://back-matcha.pandeo.fr/image/0c86c1d7-2b84-453e-9a32-978d576fc552"], "bio": "Oui", "tags": { "vegan": True }, "age": 20, "orientation": "heterosexual", "gender": "male"}
    response = requests.put('https://back-matcha.pandeo.fr/user', json.dumps(data))
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(4)
def test_update_profile_random():
    response = requests.put('https://back-matcha.pandeo.fr/user', "{}", headers={"authorization": "Bearer %s" % generate_token()})
    print(response.json())
    assert response.status_code == 400
    assert response.json() == {'message': "Missing key(s): ['email', 'lastName', 'firstName', 'images', 'bio', 'tags', 'orientation', 'gender']"}

@pytest.mark.order(4)
def test_update_profile():
    data = {"email": "%s@nofoobar.com" % str, "lastName": "Theo", "firstName": "Nard", "images": ["https://back-matcha.pandeo.fr/image/0c86c1d7-2b84-453e-9a32-978d576fc552"], "bio": "Oui", "tags": { "vegan": True }, "age": 20, "orientation": "heterosexual", "gender": "male"}
    response = requests.put('https://back-matcha.pandeo.fr/user', json.dumps(data), headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json() == {'message': "Your profile has been updated"}

@pytest.mark.order(100)
def test_logout_without_token():
    response = requests.post("https://back-matcha.pandeo.fr/user/logout")
    assert response.status_code == 401
    assert response.json() == {'message': 'Authentication is required'}

@pytest.mark.order(100)
def test_logout():
    response = requests.post("https://back-matcha.pandeo.fr/user/logout", headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200
    assert response.json() == {'message': 'Logout Success'}
