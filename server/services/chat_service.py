import aiosmtplib
from constants.email import EMAIL

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from services.user_service import search_user_by_id, strip_user


async def get_chat_rooms(db, user):
    rooms = await db.fetch(
        "SELECT * FROM chat WHERE user_1 = $1 OR user_2 = $1", user["id"]
    )
    _rooms = []
    for room in rooms:
        _room = dict(room)
        _room["messages"] = []
        messages = await db.fetch(
            "SELECT * FROM messages WHERE chat_id = $1 ORDER BY date DESC", room["id"]
        )
        for message in messages:
            _message = dict(message)
            _message.pop("chat_id")
            _room["messages"].append(_message)
        for user in ['user_1', 'user_2']:
            _user = await search_user_by_id(db, _room[user])
            _room[user] = {
                "id": _user["id"],
                "firstName": _user["first_name"],
                "image": _user["images"][0] if _user["images"] and len(_user["images"]) > 0 else None,
            }
            
        _rooms.append(_room)
    return _rooms

async def check_room(db, room_id):
    try:
        room = await db.fetchrow(
            "SELECT * FROM chat WHERE id = $1", room_id
        )
        if not room:
            return None
        return room
    except Exception:
        return None