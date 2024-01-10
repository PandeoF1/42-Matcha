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

password_rules = {
    "length_min": 8,
    "length_max": 30,
    "special": 1,
    "number": 1,
    "upper": 1,
    "lower": 1,
}

def check_password(password):
    if len(password) < password_rules["length_min"]:
        return password_too_short()
    if len(password) > password_rules["length_max"]:
        return password_too_long()
    if not any(char.isdigit() for char in password):
        return password_no_number()
    if not any(char.isupper() for char in password):
        return password_no_upper()
    if not any(char.islower() for char in password):
        return password_no_lower()
    if not any(char in "!@#$%^&*()-+?_=,<>/;:[]{}" for char in password):
        return password_no_special()
    return None


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


async def create_user(db, body: dict):

    try:
        missing = missing_keys(
            ["email", "username", "last_name", "first_name", "password"], body
        )
        if missing:
            return missing
        empty = empty_keys(body)
        if empty:
            return empty
        if check_password(body["password"]) is not None:
            return check_password(body["password"])
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
        regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
        if not re.match(regex, body["email"]):
            return invalid_email()
        # check if email already exists

        email = await db.fetchrow(
            """SELECT id, email FROM users WHERE email = $1""", body["email"]
        )
        # print (users)
        if email:
            return email_already_exists()
        username = await db.fetchrow(
            """SELECT id, username FROM users WHERE username = $1""", body["username"]
        )
        if username:
            return username_already_exists()

        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())

        user_id = str(uuid.uuid4())
        # save in db
        await db.execute(
            """INSERT INTO users (id, email, username, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5, $6)""",
            user_id,
            body["email"],
            body["username"],
            body["first_name"],
            body["last_name"],
            hashed_password.decode(),
        )
        # random 64 alphanum str
        token = "".join(
            random.choices(
                string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64
            )
        )
        token_id = str(uuid.uuid4())

        # save token in db
        await db.execute(
            """INSERT INTO token (id, token, user_id) VALUES ($1, $2, $3)""",
            token_id,
            token,
            user_id,
        )
        # Create email validation token
        token_id = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        await db.execute(
            """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
            token_id,
            datetime.datetime.now(),
            user_id,
            "email_validation"
        )
        subject = "Welcome to Adopt A Goose"
        content = "Welcome to Adopt A Goose, please click on the following link to validate your email address: " + str(URL_FRONT) + "validate_email/" + token_id
        send_email(body["email"], subject, content)
        return account_created({"token": token})

    except Exception as e:
        print(e)

async def validate_email(db, body):
    try:
        missing = missing_keys(["token"], body)
        if missing:
            return missing
        token_id = body["token"]
        result = await db.fetchrow("""SELECT * FROM email_validation WHERE id = $1""", token_id)
        if not result:
            return invalid_email_token()
        if result["type"] != "email_validation":
            return invalid_email_token()
        await db.execute("""UPDATE users SET completion = 1 WHERE id = $1""", result["user_id"])
        await db.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return email_validated()
    except Exception as e:
        print(e)

async def change_password(db, body):
    try:
        missing = missing_keys(["token", "password"], body)
        if missing:
            return missing
        token_id = body["token"]
        result = await db.fetchrow("""SELECT * FROM email_validation WHERE id = $1""", token_id)
        if not result:
            return invalid_email_token()
        if result["type"] != "password_reset":
            return invalid_email_token()
        if check_password(body["password"]) is not None:
            return check_password(body["password"])
        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
        await db.execute("""UPDATE users SET password = $1 WHERE id = $2""", hashed_password.decode(), result["user_id"])
        await db.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return password_reset()
    except Exception as e:
        print(e)
        
        

async def ask_reset_password(db, body):
    try:
        missing = missing_keys(["email"], body)
        if missing:
            return missing
        email = body["email"]
        result = await db.fetchrow("""SELECT * FROM users WHERE email = $1""", email)
        if not result:
            return email_ask_reset_password()
        token_id = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        await db.execute(
            """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
            token_id,
            datetime.datetime.now(),
            result["id"],
            "password_reset"
        )
        subject = "Password reset"
        content = "You asked for a password reset, please click on the following link to reset your password: " + str(URL_FRONT) + "reset_password/" + token_id
        send_email(email, subject, content)
        return email_ask_reset_password()
    except Exception as e:
        print(e)