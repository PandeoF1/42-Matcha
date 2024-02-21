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
            _message.pop("id")
            # reverse messages
            _room["messages"].append(_message)
        _room["messages"] = list(reversed(_room["messages"]))
        for user_ in ['user_1', 'user_2']:
            _user = await search_user_by_id(db, _room[user_])
            _room[user_] = {
                "id": _user["id"],
                "firstName": _user["first_name"],
                "image": _user["images"][0] if _user["images"] and len(_user["images"]) > 0 else None,
            }
            
        if _room["user_1"]["id"] != user["id"]:
            _room["user_1"], _room["user_2"] = _room["user_2"], _room["user_1"]
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