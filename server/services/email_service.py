import smtplib
from email.mime.text import MIMEText
from constants.email import EMAIL

def send_email(email, subject, body):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = EMAIL['email']
        msg['To'] = email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(EMAIL['email'], EMAIL['password'])
            smtp_server.sendmail(EMAIL['email'], email, msg.as_string())
        return True
    except Exception:
        return False
