import resend
import os
from dotenv import load_dotenv
load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def send_email(to, subject, body):
    params = {
        "from": "Surplus App <no-reply@surplus.app>",
        "to": [to],
        "subject": subject,
        "text": body
    }
    resend.Emails.send(params)