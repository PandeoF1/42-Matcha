import dotenv
import os

dotenv.load_dotenv()

EMAIL = {
    "email": os.getenv('EMAIL'),
    "password": os.getenv('EMAIL_PASSWORD'),
    "host": "smtp.gmail.com",
    "port": 465
}