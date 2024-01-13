import json
import asyncpg
import dotenv
import requests
import pytest
import os
from conftest import str, generate_token

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@pytest.mark.order(5)
def test_get_geoloc():
    response = requests.get("https://back-matcha.pandeo.fr/geoloc",
        headers={"authorization": "Bearer %s" % generate_token()})
    assert response.status_code == 200

