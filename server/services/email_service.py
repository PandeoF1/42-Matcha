import aiosmtplib
from constants.email import EMAIL

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

async def send_email(email, subject, body):
    try:
        msg = MIMEMultipart()
        msg.preamble = subject
        msg['Subject'] = subject
        msg['From'] = EMAIL['email']
        msg['To'] = email
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        smtp = aiosmtplib.SMTP(hostname=EMAIL['host'], port=EMAIL['port'], use_tls=True)
        await smtp.connect()
        await smtp.login(EMAIL['email'], EMAIL['password'])
        await smtp.send_message(msg)
        await smtp.quit()
        return True
    except Exception as e:
        print(e)
        return False
