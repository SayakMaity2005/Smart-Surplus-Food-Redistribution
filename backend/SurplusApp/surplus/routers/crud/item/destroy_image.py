import cloudinary
import os
from dotenv import load_dotenv
load_dotenv()

CLOUD_NAME = os.getenv("CLOUD_NAME")
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET
)

def extract_public_id(url: str) -> str:
    # Split by '/upload/'
    parts = url.split('/upload/')
    if len(parts) != 2:
        return {"status": 200, "message": "Invalid Cloudinary URL format"}
    # After 'upload/', remove version and extension
    path = parts[1]
    # Remove version (e.g., v1729354901/)
    if path.startswith("v") and "/" in path:
        path = path.split("/", 1)[1]
    else:
        # Sometimes version is omitted
        path = path
    # Remove extension (.jpg, .png, etc.)
    public_id = path.rsplit('.', 1)[0]
    return public_id

async def destroy_image(image_url: str):
    if not image_url or image_url == "":
        return {"status": 404, "message": "No image URL provided"}
    try:
        response = cloudinary.uploader.destroy(extract_public_id(image_url))
    except Exception as e:
        return {"status": 500, "message": f"Error destroying image: {str(e)}"}
    return {"status": 200, "message": "Image destroyed successfully"}
