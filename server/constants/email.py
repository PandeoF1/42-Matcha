import dotenv
import os

dotenv.load_dotenv()

EMAIL = {
    "email": os.getenv('EMAIL'),
    "password": os.getenv('EMAIL_PASSWORD'),
    "smtp": "smtp.gmail.com",
    "smtp_port": 465
}