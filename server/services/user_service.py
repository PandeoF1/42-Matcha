from models.user.user_dao import User
import json
from responses.success.errors_200 import *
from responses.errors.errors_400 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
import re
import bcrypt

async def check_token(db, token):
    result = await db.fetchrow("""SELECT id FROM token WHERE token = $1""", token)
    if not result:
        return invalid_token()
    return None

async def create_user(db, body: dict):
    password = {"length_min": 6, "length_max": 30, "special": 1, "number": 1, "upper": 1, "lower": 1}
    try:
        missing = missing_keys(["email", "username", "last_name", "first_name", "password"], body)
        if missing:
            return missing
        empty = empty_keys(body)
        if empty:
            return empty
        # password
        if len(body["password"]) < password["length_min"]:
            return password_too_short()
        if len(body["password"]) > password["length_max"]:
            return password_too_long()
        if not any(char.isdigit() for char in body["password"]):
            return password_no_number()
        if not any(char.isupper() for char in body["password"]):
            return password_no_upper()
        if not any(char.islower() for char in body["password"]):
            return password_no_lower()
        if not any(char in "!@#$%^&*()-+?_=,<>/;:[]{}" for char in body["password"]):
            return password_no_special()
        # username
        if len(body["username"]) < 3:
            return username_too_short()
        if len(body["username"]) > 30:
            return username_too_long()
        if not body["username"].isalnum():
            return username_not_alphanumeric()
        # first name
        if len(body["first_name"]) < 2:
            return first_name_too_short()
        if len(body["first_name"]) > 30:
            return first_name_too_long()
        if not body["first_name"].isalpha():
            return first_name_not_alphanumeric()
        # last name
        if len(body["last_name"]) < 2:
            return last_name_too_short()
        if len(body["last_name"]) > 30:
            return last_name_too_long()
        if not body["last_name"].isalpha():
            return last_name_not_alphanumeric()
            
        # email
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.match(regex, body["email"]):
            return invalid_email()
        # check if email already exists

        email = await db.fetchrow("""SELECT id, email FROM users WHERE email = $1""", body["email"])
        # print (users)
        if email:
            return email_already_exists()
        username = await db.fetchrow("""SELECT id, username FROM users WHERE username = $1""", body["username"])
        if username:
            return username_already_exists()
        
        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
        print(hashed_password)
        # compare password with hashed password
        #for user in users:
        #    print(user)
        data = {}
        data['token'] = "oui"
        return account_created_200(data)
    except Exception as e:
        print(e)
