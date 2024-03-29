import json
from fastapi import Request


async def parse_request(request: Request):
    try:
        headers = request.headers
        body = await request.body()

        parsed = {}
        try:
            parsed["headers"] = dict(headers) if headers else None
        except:
            parsed["headers"] = None
        try:
            parsed["body"] = json.loads(body) if body else None
        except:
            parsed["body"] = None

        return parsed
    except Exception as e:
        return {'headers': None, 'body': None, 'error': 'Error parsing request.'}