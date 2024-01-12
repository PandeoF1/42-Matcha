import json
import random
import string
import requests

str = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10))
token = None

def generate_token():
    global token
    if token is not None:
        return token
    data = {"username":"%s" % str,"password":"Qw@rty123456"}
    response = requests.post("https://back-matcha.pandeo.fr/user/login",json.dumps(data))
    assert response.status_code == 200
    assert response.json()['message'] == 'Login Success'
    assert response.json()['token'] is not None
    token = response.json()['token']
    return token