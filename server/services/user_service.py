from models.user.user_dao import User
import json
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
import re
import bcrypt
import uuid
import random
import string

async def check_token(db, token):
    result = await db.fetchrow("""SELECT * FROM token WHERE token = $1""", token)
    if not result:
        return None
    return result["user_id"]

async def search_user(db, user_id):
    result = await db.fetchrow("""SELECT * FROM users WHERE id = $1""", user_id)
    if not result:
        return None
    return result

async def search_user_by_username(db, username):
    result = await db.fetchrow("""SELECT * FROM users WHERE username = $1""", username)
    if not result:
        return None
    return result

async def search_user_by_email(db, email):
    result = await db.fetchrow("""SELECT * FROM users WHERE email = $1""", email)
    if not result:
        return None
    return result

async def search_user_by_token(db, token):
    result = await db.fetchrow("""SELECT user_id FROM token WHERE token = $1""", token)
    if not result:
        return None
    result = await search_user(db, result["user_id"])
    return result


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

        user_id = str(uuid.uuid4())
        # save in db
        await db.execute("""INSERT INTO users (id, email, username, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)""", user_id, body["email"], body["username"], body["first_name"], body["last_name"], hashed_password.decode())
        print("user created")
        #random 64 alphanum str
        token = ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))

        token_id = str(uuid.uuid4())

        # save token in db
        await db.execute("""INSERT INTO token (id, token, user_id) VALUES ($1, $2, $3)""", token_id, token, user_id)
        return account_created({"token": token})

        # send email
    except Exception as e:
        print(e)

async def login_user(db, body: dict):
    try:
        missing = missing_keys(["username", "password"], body)
        if missing:
            return missing
        user = await search_user_by_username(db, body["username"])
        if not user:
            return invalid_username_or_password()
        if not bcrypt.checkpw(body["password"].encode(), user["password"].encode()):
            return invalid_username_or_password()
        #random 64 alphanum str
        token_id = str(uuid.uuid4())
        token = ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        await db.execute("""INSERT INTO token (id, token, user_id) VALUES ($1, $2, $3)""", token_id, token, user["id"])
        return login_success({"token": token})

    except Exception as e:
        print(e)

async def logout_user(db, token):
    try:
        user_id = await check_token(db, token)
        if user_id is None:
            return invalid_token()
        await db.execute("""DELETE FROM token WHERE user_id = $1""", user_id)
        return logout_success()
    except Exception as e:
        print(e)