import aiosmtplib
import magic
import uuid

from responses.errors.errors_400 import image_invalid, missing_body
from responses.success.success_201 import image_success
from constants.domain import URL_BACK

async def image_upload(db, user, form):
    if 'image' not in form:
        return missing_body()
    image = await form["image"].read()
    if magic.from_buffer(image, mime=True) != 'image/jpeg' and magic.from_buffer(image, mime=True) != 'image/png':
        return image_invalid()
    id = uuid.uuid4()
    print('type: ', type(image))
    await db.execute("INSERT INTO images (id, user_id, image) VALUES ($1, $2, $3)", id, user['id'], image)
    return image_success(url = f"{URL_BACK}image/{id}")