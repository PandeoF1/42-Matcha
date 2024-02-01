from fastapi import APIRouter, Depends,WebSocket, WebSocketDisconnect, Request
from database.database import get_database
from services.user_service import *
import uuid

notifications_controller = APIRouter(prefix="/notifications", tags=["notifications"])

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

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection["socket"].send_text(message)

manager = ConnectionManager()

@notifications_controller.websocket("")
async def websocket_endpoint(websocket: WebSocket, db=Depends(get_database)):
    if websocket.query_params.get("token") is None:
        await websocket.close(reason="Invalid token")
        return
    user = await search_user_by_token(db, websocket.query_params.get("token"))
    if not user:
        await websocket.close(reason="Invalid token")
        return
    await manager.connect(websocket, user["id"])
    try:
        while True:
            data = await websocket.receive_text()
            #await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        return


@notifications_controller.get("/test")
async def test(request: Request, db=Depends(get_database)):
    # emit notification
    token = get_token(request.headers)
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    #await manager.broadcast("hello")
    await manager.send(user["id"], {'message': 'hello'})
    return {"status": "ok"}