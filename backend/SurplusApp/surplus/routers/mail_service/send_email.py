# import resend
# import os
# from dotenv import load_dotenv
# load_dotenv()

# resend.api_key = os.getenv("RESEND_API_KEY")

# def send_email(to, subject, body):
#     params = {
#         "from": "Surplus App <onboarding@resend.dev>",
#         "to": [to],
#         "subject": subject,
#         "text": body
#     }
#     resend.Emails.send(params)

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
from dotenv import load_dotenv
load_dotenv()

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)

def send_email(to, subject, body):
    send_email = sib_api_v3_sdk.SendSmtpEmail(
        sender={"email": "teamzerobite@gmail.com", "name": "TeamZerobite"},
        to=[{"email": to}],
        subject=subject,
        html_content=f"<p>{body}</p>"
    )

    try:
        api_instance.send_transac_email(send_email)
    except ApiException as e:
        raise Exception(f"Email sending failed: {e}")
