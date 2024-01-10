from tabnanny import check
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
from constants.domain import URL_FRONT
from services.email_service import *
import re
import datetime
import bcrypt
import uuid
import random
import string

def strip_user(user):
    if not user:
        return None
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "firstName": user["first_name"],
        "lastName": user["last_name"],
        "images": user["images"],
        "completion": user["completion"],
        "gender": user["gender"],
        "orientation": user["orientation"],
        "tags": user["tags"],
        "bio": user["bio"],
        "geoloc": user["geoloc"],
        "birthDate": user["birthdate"] 
    }

def check_password(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,30}$"
    if not re.match(regex, password):
        return invalid_password()
    return None

def check_username(username):
    regex = r"^[a-zA-Z0-9]{3,16}$"
    if not re.match(regex, username):
        return invalid_username()
    return None

def check_last_name(last_name):
    regex = r"^[a-zA-Z]{3,16}$"
    if not re.match(regex, last_name):
        return invalid_last_name()
    return None

def check_first_name(first_name):
    regex = r"^[a-zA-Z]{3,16}$"
    if not re.match(regex, first_name):
        return invalid_first_name()
    return None

def check_email(email):
    regex = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}$"
    if not re.match(regex, email):
        return invalid_email()
    return None

async def search_user_by_id(db, user_id):
    try:
        async with db.acquire() as conn:
            result = await conn.fetchrow("""SELECT * FROM users WHERE id = $1""", user_id)
        if not result:
            return None
        return result
    except Exception:
        return None

async def search_user_by_username(db, username):
    async with db.acquire() as conn:
        result = await conn.fetchrow("""SELECT * FROM users WHERE username = $1""", username)
    if not result:
        return None
    return result


async def search_user_by_email(db, email):
    async with db.acquire() as conn:
        result = await conn.fetchrow("""SELECT * FROM users WHERE email = $1""", email)
    if not result:
        return None
    return result

async def search_user_by_token(db, token):
    async with db.acquire() as conn:
        result = await conn.fetchrow("""SELECT user_id FROM token WHERE token = $1""", token)
    if not result:
        return None
    result = await search_user_by_id(db, result["user_id"])
    return result

async def create_user(db, body: dict):
    try:
        if check_password(body["password"]) is not None:
            return check_password(body["password"])
        # username
        if check_username(body["username"]) is not None:
            return check_username(body["username"])
        # first name
        if check_first_name(body["firstName"]) is not None:
            return check_first_name(body["firstName"])
        # last name
        if check_last_name(body["lastName"]) is not None:
            return check_last_name(body["lastName"])
        # email
        if check_email(body["email"]) is not None:
            return check_email(body["email"])
        # check if email already exists
        async with db.acquire() as conn:
            email = await conn.fetchrow(
                """SELECT id, email FROM users WHERE email = $1""", body["email"]
            )
        # print (users)
        if email:
            return email_already_exists()
        async with db.acquire() as conn:
            username = await conn.fetchrow(
                """SELECT id, username FROM users WHERE username = $1""", body["username"]
            )
        if username:
            return username_already_exists()

        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())

        user_id = str(uuid.uuid4())
        async with db.acquire() as conn:
            await conn.execute(
                """INSERT INTO users (id, email, username, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)""",
                user_id,
                body["email"],
                body["username"],
                body["firstName"],
                body["lastName"],
                hashed_password.decode(),
            )

        # Create email validation token
        token_id = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        async with db.acquire() as conn:
            await conn.execute(
                """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
                token_id,
                datetime.datetime.now(),
                user_id,
                "email_validation"
            )
        subject = "Welcome to Adopt A Goose"
        content = "Welcome to Adopt A Goose, please click on the following link to validate your email address: " + str(URL_FRONT) + "validate-email/" + token_id
        await send_email(body["email"], subject, content)
        return account_created()

    except Exception as e:
        print(e)

async def validate_email(db, body):
    try:
        token_id = body["token"]
        async with db.acquire() as conn:
            result = await conn.fetchrow("""SELECT * FROM email_validation WHERE id = $1""", token_id)
        if not result:
            return invalid_email_token()
        if result["type"] != "email_validation":
            return invalid_email_token()
        async with db.acquire() as conn:
            await conn.execute("""UPDATE users SET completion = 1 WHERE id = $1""", result["user_id"])
        async with db.acquire() as conn:
            await conn.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return email_validated()
    except Exception as e:
        print(e)

async def change_password(db, body):
    try:
        token_id = body["token"]
        async with db.acquire() as conn:
            result = await conn.fetchrow("""SELECT * FROM email_validation WHERE id = $1""", token_id)
        if not result:
            return invalid_email_token()
        if result["type"] != "password_reset":
            return invalid_email_token()
        if check_password(body["password"]) is not None:
            return check_password(body["password"])
        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
        async with db.acquire() as conn:
            await conn.execute("""UPDATE users SET password = $1 WHERE id = $2""", hashed_password.decode(), result["user_id"])
        async with db.acquire() as conn:
            await conn.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return password_reset()
    except Exception as e:
        print(e)


async def ask_reset_password(db, user):
    try:
        email = user["email"]
        async with db.acquire() as conn:
            result = await conn.fetchrow("""SELECT * FROM users WHERE email = $1""", email)
        if not result:
            return email_ask_reset_password()
        token_id = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        async with db.acquire() as conn:
            await conn.execute(
                """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
                token_id,
                datetime.datetime.now(),
                result["id"],
                "password_reset"
            )
        subject = "Password reset"
        content = "You asked for a password reset, please click on the following link to reset your password: " + str(URL_FRONT) + "reset-password/" + token_id
        await send_email(email, subject, content)
        return email_ask_reset_password()
    except Exception as e:
        print(e)

def get_token(headers):
    if (
        "authorization" not in headers
        or len(headers["authorization"].split(" ")) != 2
        or headers["authorization"].split(" ")[1] is None
    ):
        return None
    return headers["authorization"].split(" ")[1]

async def check_token(db, token):
    async with db.acquire() as conn:
        result = await conn.fetchrow("""SELECT * FROM token WHERE token = $1""", token)
    if not result:
        return None
    # check if token is expired
    if (datetime.datetime.now().timestamp() - result["last_activity"] > 3600 * 6):
        async with db.acquire() as conn:
            await conn.execute("""DELETE FROM token WHERE token = $1""", token)
        return None
    # Update last activity
    async with db.acquire() as conn:
        await conn.execute("""UPDATE token SET last_activity = $1 WHERE token = $2""", datetime.datetime.now().timestamp(), token)
    return result["user_id"]

async def login_user(db, body: dict):
    try:
        user = await search_user_by_username(db, body["username"])
        if not user:
            return invalid_username_or_password()
        if not bcrypt.checkpw(body["password"].encode(), user["password"].encode()):
            return invalid_username_or_password()
        if user['completion'] == 0:
            return email_not_validated()
        token_id = str(uuid.uuid4())
        token = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        async with db.acquire() as conn:
            await conn.execute(
                """INSERT INTO token (id, token, user_id, creation_date, last_activity) VALUES ($1, $2, $3, $4, $5)""",
                token_id,
                token,
                user["id"],
                datetime.datetime.now().timestamp(),
                datetime.datetime.now().timestamp()
            )
        subject = "New connection detected"
        content = "Someone just connected to your account at " + datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        await send_email(user["email"], subject, content)
        return login_success(token)

    except Exception as e:
        print(e)

async def logout_user(db, token):
    try:
        async with db.acquire() as conn:
            await conn.execute("""DELETE FROM token WHERE token = $1""", token)
        return logout_success()
    except Exception as e:
        print(e)
