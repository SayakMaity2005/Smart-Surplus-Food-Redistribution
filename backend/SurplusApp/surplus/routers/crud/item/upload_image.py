import cloudinary
from fastapi import APIRouter, File, UploadFile, HTTPException
import io
import os
from PIL import Image
import cloudinary.uploader
import tempfile

CLOUD_NAME = "das5u9tjg"
API_KEY = "812321471543311"
API_SECRET = "DE297QSdbRgO3mLTk7vyNfY458E"

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET
)

router = APIRouter()

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Save to buffer with compression
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=70)  # lowering quality
        buffer.seek(0)

        # Save temporarily
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(buffer.read())
            tmp_path = tmp.name

        # Upload to Cloudinary securely
        upload_result = cloudinary.uploader.upload(
            tmp_path,
            folder="surplus_food",  # auto-creates if not exists
            resource_type="image"
        )

        # clear buffer and temp path
        # buffer.close()
        os.remove(tmp_path)

        return {"message": "Image uploaded succesful", "image_url": upload_result["secure_url"]}
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
