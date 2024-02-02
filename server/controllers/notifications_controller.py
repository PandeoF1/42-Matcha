from fastapi import APIRouter, Depends,WebSocket, WebSocketDisconnect, Request
from database.database import get_database
from responses.success.success_200 import *
from responses.success.success_201 import *
from responses.errors.errors_400 import *
from responses.errors.errors_409 import *
from responses.errors.errors_422 import *
from responses.errors.errors_401 import *

notifications_controller = APIRouter(prefix="/notifications", tags=["notifications"])

async def search_user_by_id(db, user_id):
    try:
        result = await db.fetchrow("""SELECT * FROM users WHERE id = $1""", user_id)
        if not result:
            return None
        return result
    except Exception:
        return None
    
def get_token(headers):
    if (
        "authorization" not in headers
        or len(headers["authorization"].split(" ")) != 2
        or headers["authorization"].split(" ")[1] is None
    ):
        return None
    return headers["authorization"].split(" ")[1]

async def search_user_by_token(db, token):
    result = await db.fetchrow("""SELECT user_id FROM token WHERE token = $1""", token)
    if not result:
        return None
    result = await search_user_by_id(db, result["user_id"])
    return result

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[dict] = []

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append({'socket': websocket, 'user_id': user_id})

    def disconnect(self, websocket: WebSocket):
        for connection in self.active_connections:
            if connection["socket"] == websocket:
                self.active_connections.remove(connection)
                break

    async def send(self, user_id, message):
        for connection in self.active_connections:
            if connection["user_id"] == user_id:
                await connection["socket"].send_json(message)

    async def broadcast(self, user_id, message):
        for connection in self.active_connections:
            await connection["socket"].send_json(message)

notification_socket = ConnectionManager()

@notifications_controller.websocket("")
async def websocket_endpoint(websocket: WebSocket, db=Depends(get_database)):
    if websocket.query_params.get("token") is None:
        await websocket.close(reason="Invalid token")
        return
    user = await search_user_by_token(db, websocket.query_params.get("token"))
    if not user:
        await websocket.close(reason="Invalid token")
        return
    await notification_socket.connect(websocket, user["id"])
    try:
        while True:
            data = await websocket.receive_text()
            #await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        notification_socket.disconnect(websocket)
        return

async def notification(user_id, message):
    await notification_socket.send(user_id, message)
    
@notifications_controller.get("/test")
async def test(request: Request, db=Depends(get_database)):
    # emit notification
    token = get_token(request.headers)
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    await notification_socket.broadcast(user["id"], {'message': 'Yo le rap'})
    return {"status": "ok"}