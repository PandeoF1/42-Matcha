import json
from fastapi import Request

async def parse_request(request: Request):
    headers = request.headers
    body = await request.body()

    parsed = {
        "headers": dict(headers) if headers else None,
        "body": json.loads(body) if body else None,
    }

    return parsed