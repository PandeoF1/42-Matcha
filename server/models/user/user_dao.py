from datetime import datetime
import uuid


class User:
    id: uuid.UUID
    first_name: str
    last_name: str
    username: str
    password: str
    email: str
    images: list[str]
    status: int
    completion: int
    last_activity: datetime
    gender: str
    orientation: str
    tags: list[str]
    elo: int
    bio: str
    geoloc: str
    birthdate: datetime
