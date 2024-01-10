from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
from services.email_service import send_email
from services.user_service import search_user, search_user_by_username
import re
import bcrypt
import uuid
import random
import string
import datetime

async def check_token(db, token):
    result = await db.fetchrow("""SELECT * FROM token WHERE token = $1""", token)
    if not result:
        return None
    return result["user_id"]

async def search_user_by_token(db, token):
    result = await db.fetchrow("""SELECT user_id FROM token WHERE token = $1""", token)
    if not result:
        return None
    result = await search_user(db, result["user_id"])
    return result

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
        # random 64 alphanum str
        token_id = str(uuid.uuid4())
        token = "".join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64))
        await db.execute(
            """INSERT INTO token (id, token, user_id) VALUES ($1, $2, $3)""",
            token_id,
            token,
            user["id"],
        )
        subject = "New connection detected"
        content = "Someone just connected to your account at " + datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        print(user["email"])
        send_email(user["email"], subject, content)
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
