from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import HTMLResponse
import magic
from database.database import *
from responses.errors.errors_401 import authentication_required, incomplete_profile
from responses.errors.errors_404 import image_not_found
from services.image_service import image_upload
from services.user_service import (
    ask_reset_password,
    get_token,
    search_user_by_token,
    validate_email,
    change_password,
)
from utils.parse_request import *
from responses.errors.errors_422 import *
from responses.errors.errors_400 import *

image_controller = APIRouter(prefix="/image", tags=["email"])


@image_controller.post("/upload")
async def upload_image(request: Request, db=Depends(get_database)):
    data = {}
    data["form"] = await request.form()
    data["headers"] = request.headers
    if data["headers"] is None or data["form"] is None:
        return missing_body()
    token = get_token(data["headers"])
    if token is None:
        return empty_token()
    user = await search_user_by_token(db, token)
    if not user:
        return authentication_required()
    if user["completion"] < 1:
        return incomplete_profile()
    return await image_upload(db, user, data["form"])


@image_controller.get("/{id}")
async def get_image(id, request: Request, db=Depends(get_database)):
    # if id is uuid
    try:
        image = await db.fetchrow("SELECT image FROM images WHERE id = $1", id)
    except:
        return image_not_found()
    if not image:
        return image_not_found()
    content = image["image"]._bytes
    return Response(content, media_type=magic.from_buffer(content, mime=True))
