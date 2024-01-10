import string
import requests
import random

# for 100 times
for i in range(100):
    # generate a random email
    email = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10)) + "@gmail.com"
    # send a request to register
    r = requests.post("https://back-matcha.pandeo.fr/user", json={
        "username": random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=10),
        "password": "Test123467895!",
        "firstName": "test",
        "lastName": "test",
        "email": email
    })
    # print the response
    print(r.json())