import json
import asyncpg
import dotenv
import requests
import pytest
import os
from conftest import str, generate_token

# Completion 1


@pytest.mark.order(3)
def test_get_profiles_without_token_1():
    response = requests.get("https://back-matcha.pandeo.fr/profiles")
    assert response.status_code == 401
    assert response.json() == {"message": "Authentication is required"}


@pytest.mark.order(3)
def test_get_profiles_1():
    response = requests.get(
        "https://back-matcha.pandeo.fr/profiles",
        headers={"authorization": "Bearer %s" % generate_token()},
    )
    assert response.status_code == 401
    assert response.json() == {"message": "Your profile is incomplete"}


# Completion 2 #5
