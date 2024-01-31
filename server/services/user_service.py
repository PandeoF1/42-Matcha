import json
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *
from constants.domain import URL_BACK, URL_FRONT
from responses.errors.errors_404 import user_not_found
from constants.tags import TAGS
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
        "images": user["images"] if user["images"] else [],
        "completion": user["completion"],
        "gender": user["gender"],
        "orientation": user["orientation"],
        "tags": json.loads(user["tags"]),
        "bio": user["bio"] if user["bio"] else "",
        "geoloc": user["geoloc"],
        "age": user["age"],
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
    regex = r"^[a-zA-Z\u00C0-\u00FF]{3,16}$"
    if not re.match(regex, last_name):
        return invalid_last_name()
    return None


def check_first_name(first_name):
    regex = r"^[a-zA-Z\u00C0-\u00FF]{3,16}$"
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
        result = await db.fetchrow("""SELECT * FROM users WHERE id = $1""", user_id)
        if not result:
            return None
        return result
    except Exception:
        return None


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
        email = await db.fetchrow(
            """SELECT id, email FROM users WHERE email = $1""", body["email"]
        )
        # print (users)
        if email:
            return email_already_exists()
        email = await db.fetchrow(
            """SELECT id FROM email_validation WHERE value = $1""", body["email"]
        )
        if email:
            return email_already_exists()
        username = await db.fetchrow(
            """SELECT id, username FROM users WHERE username = $1""", body["username"]
        )
        if username:
            return username_already_exists()

        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())

        user_id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO users (id, email, username, first_name, last_name, password, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)""",
            user_id,
            body["email"],
            body["username"],
            body["firstName"],
            body["lastName"],
            hashed_password.decode(),
            json.dumps(TAGS),
        )

        # Create email validation token
        token_id = "".join(
            random.choices(
                string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64
            )
        )
        await db.execute(
            """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
            token_id,
            datetime.datetime.now(),
            user_id,
            "email_validation",
        )
        subject = "Welcome to Adopt A Goose"
        content = (
            "Welcome to Adopt A Goose, please click on the following link to validate your email address: "
            + str(URL_FRONT)
            + "validate-email/"
            + token_id
        )
        await send_email(body["email"], subject, content)
        return account_created()

    except Exception as e:
        print(e)


async def validate_email(db, body):
    try:
        token_id = body["token"]
        result = await db.fetchrow(
            """SELECT * FROM email_validation WHERE id = $1""", token_id
        )
        if not result:
            return invalid_email_token()
        if result["type"] != "email_validation" and result["type"] != "email_change":
            return invalid_email_token()
        if result["type"] == "email_change":
            await db.execute(
                """UPDATE users SET email = $1 WHERE id = $2""",
                result["value"],
                result["user_id"],
            )
        else:
            await db.execute(
                """UPDATE users SET completion = 1 WHERE id = $1""", result["user_id"]
            )
        await db.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return email_validated()
    except Exception as e:
        print(e)


async def change_password(db, body):
    try:
        token_id = body["token"]
        result = await db.fetchrow(
            """SELECT * FROM email_validation WHERE id = $1""", token_id
        )
        if not result:
            return invalid_email_token()
        if result["type"] != "password_reset":
            return invalid_email_token()
        if check_password(body["password"]) is not None:
            return check_password(body["password"])
        hashed_password = bcrypt.hashpw(body["password"].encode(), bcrypt.gensalt())
        await db.execute(
            """UPDATE users SET password = $1 WHERE id = $2""",
            hashed_password.decode(),
            result["user_id"],
        )
        await db.execute("""DELETE FROM email_validation WHERE id = $1""", token_id)
        return password_reset()
    except Exception as e:
        print(e)


async def ask_reset_password(db, user):
    try:
        email = user["email"]
        result = await db.fetchrow("""SELECT * FROM users WHERE email = $1""", email)
        if not result:
            return email_ask_reset_password()
        token_id = "".join(
            random.choices(
                string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64
            )
        )
        await db.execute(
            """INSERT INTO email_validation (id, creation_date, user_id, type) VALUES ($1, $2, $3, $4)""",
            token_id,
            datetime.datetime.now(),
            result["id"],
            "password_reset",
        )
        subject = "Password reset"
        content = (
            "You asked for a password reset, please click on the following link to reset your password: "
            + str(URL_FRONT)
            + "reset-password/"
            + token_id
        )
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
    result = await db.fetchrow("""SELECT * FROM token WHERE token = $1""", token)
    if not result:
        return None
    # check if token is expired
    if datetime.datetime.now().timestamp() - result["last_activity"] > 3600 * 6:
        await db.execute("""DELETE FROM token WHERE token = $1""", token)
        return None
    # Update last activity
    await db.execute(
        """UPDATE token SET last_activity = $1 WHERE token = $2""",
        datetime.datetime.now().timestamp(),
        token,
    )
    return result["user_id"]


async def login_user(db, body: dict):
    try:
        user = await search_user_by_username(db, body["username"])
        if not user:
            return invalid_username_or_password()
        if not bcrypt.checkpw(body["password"].encode(), user["password"].encode()):
            return invalid_username_or_password()
        if user["completion"] == 0:
            return email_not_validated()
        token_id = str(uuid.uuid4())
        token = "".join(
            random.choices(
                string.ascii_uppercase + string.digits + string.ascii_lowercase, k=64
            )
        )
        await db.execute(
            """INSERT INTO token (id, token, user_id, creation_date, last_activity) VALUES ($1, $2, $3, $4, $5)""",
            token_id,
            token,
            user["id"],
            datetime.datetime.now().timestamp(),
            datetime.datetime.now().timestamp(),
        )
        subject = "New connection detected"
        content = (
            "Someone just connected to your account at "
            + datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        )
        await send_email(user["email"], subject, content)
        return login_success(token)

    except Exception as e:
        print(e)


async def logout_user(db, token):
    try:
        await db.execute("""DELETE FROM token WHERE token = $1""", token)
        return logout_success()
    except Exception as e:
        print(e)


async def update_user(db, user, body):
    try:
        if check_email(body["email"]) is not None:
            return check_email(body["email"])
        if check_first_name(body["firstName"]) is not None:
            return check_first_name(body["firstName"])
        if check_last_name(body["lastName"]) is not None:
            return check_last_name(body["lastName"])
        if body["images"] != user["images"]:
            for image in body["images"]:
                if URL_BACK not in image:
                    return image_invalid()
            if len(body["images"]) > 5:
                return too_many_images()
        if body["orientation"] != user["orientation"]:
            if (
                body["orientation"] != "biseuxal"
                and body["orientation"] != "heterosexual"
                and body["orientation"] != "homosexual"
            ):
                return invalid_orientation()
        for tag, value in body["tags"].items():
            if tag not in TAGS:
                return invalid_tags()
            if not isinstance(value, bool):
                return invalid_tags()
        if len(body["tags"]) != len(TAGS):
            return invalid_tags()

        if body["gender"] != user["gender"]:
            if body["gender"] != "male" and body["gender"] != "female":
                return invalid_gender()
        regex = "^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$"
        if not re.match(regex, body["geoloc"]):
            return invalid_geoloc()
        if body["email"] != user["email"]:
            email = await db.fetchrow(
                """SELECT id, email FROM users WHERE email = $1""", body["email"]
            )
            if email:
                return email_already_exists()
            # Delete last email validation token
            await db.execute(
                """DELETE FROM email_validation WHERE user_id = $1 AND type = 'email_change'""",
                user["id"],
            )
            # Create email validation token
            token_id = "".join(
                random.choices(
                    string.ascii_uppercase + string.digits + string.ascii_lowercase,
                    k=64,
                )
            )
            await db.execute(
                """INSERT INTO email_validation (id, creation_date, user_id, type, value) VALUES ($1, $2, $3, $4, $5)""",
                token_id,
                datetime.datetime.now(),
                user["id"],
                "email_change",
                body["email"],
            )
            await send_email(
                user["email"],
                "Email change",
                "You asked for an email change, please click on the following link to validate your new email address: "
                + str(URL_FRONT)
                + "validate-email/"
                + token_id,
            )
        await db.execute(
            """UPDATE users SET first_name = $1, last_name = $2, age = $3, orientation = $4, gender = $5, bio = $6, tags = $7, images = $8, geoloc = $9 WHERE id = $10""",
            body["firstName"],
            body["lastName"],
            body["age"],
            body["orientation"],
            body["gender"],
            body["bio"],
            json.dumps(body["tags"]),
            body["images"],
            body["geoloc"],
            user["id"],
        )
        if user["completion"] == 1:
            _user = await search_user_by_id(db, user["id"])
            if _user is None:
                return user_not_found()
            if len(_user["images"]) > 0:
                if _user["bio"] != "":
                    if _user["geoloc"] != "0,0":
                        await db.execute(
                            """UPDATE users SET completion = 2 WHERE id = $1""", _user["id"]
                        )
        return update_success()
    except Exception as e:
        print(e)
        return update_failed()


async def is_liked(db, origin, recipient):
    try:
        result = await db.fetchrow(
            """SELECT * FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'like'""",
            origin["id"],
            recipient["id"],
        )
        if not result:
            return False
        return True
    except Exception:
        return False


async def is_blocked(db, origin, recipient):
    try:
        result = await db.fetchrow(
            """SELECT * FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'block'""",
            origin["id"],
            recipient["id"],
        )
        if not result:
            return False
        return True
    except Exception:
        return False


async def is_skipped(db, origin, recipient):
    try:
        result = await db.fetchrow(
            """SELECT * FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'skip'""",
            origin["id"],
            recipient["id"],
        )
        if not result:
            return False
        return True
    except Exception:
        return False


async def like(db, origin, recipient):
    try:
        if await is_liked(db, origin, recipient):
            return already_liked()
        if await is_blocked(db, origin, recipient):
            return user_blocked()
        if await is_blocked(db, recipient, origin):
            return user_blocked_you()
        if await is_skipped(db, origin, recipient):
            return user_skipped()
        id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO interactions (id, origin, recipient, type, date) VALUES ($1, $2, $3, $4, $5)""",
            id,
            origin["id"],
            recipient["id"],
            "like",
            datetime.datetime.now().timestamp(),
        )
        print("send notification")
        # Update elo
        await db.execute("""UPDATE users SET elo = elo + 1. WHERE id = $1""", recipient["id"])
        if origin["elo"] > 0.25:
            await db.execute("""UPDATE users SET elo = elo - 0.25 WHERE id = $1""", origin["id"])
        # send notification
        if await is_liked(db, recipient, origin) and await is_liked(
            db, origin, recipient
        ):
            return match_success()
        return like_success()
    except Exception as e:
        print(e)


async def unlike(db, origin, recipient):
    try:
        if not await is_liked(db, origin, recipient):
            return not_liked()
        if await is_liked(db, recipient, origin):
            print("unmatched delete chat")
            # remove chat

        if recipient["elo"] > 1:
            await db.execute("""UPDATE users SET elo = elo - 1. WHERE id = $1""", recipient["id"])
        await db.execute("""UPDATE users SET elo = elo + 0.25 WHERE id = $1""", origin["id"])

        await db.execute(
            """DELETE FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'like'""",
            origin["id"],
            recipient["id"],
        )
        return unlike_success()
    except Exception as e:
        print(e)


async def skip(db, origin, recipient):
    try:
        if await is_blocked(db, origin, recipient):
            return user_blocked()
        if await is_blocked(db, recipient, origin):
            return user_blocked_you()
        if await is_skipped(db, origin, recipient):
            return user_skipped()
        if await is_liked(db, origin, recipient):
            return already_liked()
        id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO interactions (id, origin, recipient, type, date) VALUES ($1, $2, $3, $4, $5)""",
            id,
            origin["id"],
            recipient["id"],
            "skip",
            datetime.datetime.now().timestamp(),
        )
        return skip_success()
    except Exception as e:
        print(e)


async def unskip(db, origin, recipient):
    try:
        if not await is_skipped(db, origin, recipient):
            return not_skipped()
        await db.execute(
            """DELETE FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'skip'""",
            origin["id"],
            recipient["id"],
        )
        return unskip_success()
    except Exception as e:
        print(e)


async def block(db, origin, recipient):
    try:
        if await is_blocked(db, origin, recipient):
            return user_blocked()
        if await is_blocked(db, recipient, origin):
            return user_blocked_you()
        id = str(uuid.uuid4())
        await db.execute(
            """INSERT INTO interactions (id, origin, recipient, type, date) VALUES ($1, $2, $3, $4, $5)""",
            id,
            origin["id"],
            recipient["id"],
            "block",
            datetime.datetime.now().timestamp(),
        )
        return block_success()
    except Exception as e:
        print(e)


async def unblock(db, origin, recipient):
    try:
        if not await is_blocked(db, origin, recipient):
            return user_not_blocked()
        await db.execute(
            """DELETE FROM interactions WHERE origin = $1 AND recipient = $2 AND type = 'block'""",
            origin["id"],
            recipient["id"],
        )
        return unblock_success()
    except Exception as e:
        print(e)


async def report(db, origin, recipient):
    try:
        id = str(uuid.uuid4())
        await db.execute("""INSERT INTO interactions (id, origin, recipient, type, date) VALUES ($1, $2, $3, $4, $5)""", id, origin["id"], recipient["id"], "report", datetime.datetime.now().timestamp())
        await send_email(
            "theo.nard18@gmail.com",
            "Report",
            "User " + origin["username"] + " reported user " + recipient["username"],
        )
        return report_success()
    except Exception as e:
        print(e)
