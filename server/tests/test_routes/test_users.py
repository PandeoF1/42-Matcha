import json
import pytest
import requests
from conftest import str, generate_token

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

@pytest.mark.order(3)
def test_get_user():
    response = requests.get("https://back-matcha.pandeo.fr/user", headers={"authorization": "Bearer %s" % generate_token()})
    print(response.json(), generate_token())
    assert response.status_code == 200
