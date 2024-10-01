from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from PIL import Image
import numpy as np
import torch
import cv2
from ultralytics import YOLO
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from ultralytics.engine.results import Results
from deepface import DeepFace
import tensorflow as tf
import h5py
from typing import List, Optional
import base64


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
# Load model Fashion
fashion_model = YOLO("D:\\Model-Fashion\\E-Fas\\best.pt")

class GenderResponse(BaseModel):
    label: str
    confidence: float


class FashionResponse(BaseModel):
    cropped_image: List[Optional[str]]
    label: List[str]
    confidence: List[float]


def load_image_into_numpy_array(data):
    return np.array(Image.open(BytesIO(data)))


@app.post("/detect-gender/", response_model=GenderResponse)
async def detect_gender(file: UploadFile = File(...)):
    img = load_image_into_numpy_array(await file.read())
    result = DeepFace.analyze(img, actions=['gender'])
    # Run gender model
    if isinstance(result, list):
        result = result[0]

    gender_confidence = result['gender']
    if gender_confidence['Woman'] > gender_confidence['Man']:
        highest_gender = 'Woman'
        highest_confidence = gender_confidence['Woman']
        return GenderResponse(label=highest_gender, confidence=highest_confidence)
    else:
        highest_gender = 'Man'
        highest_confidence = gender_confidence['Man']
        return GenderResponse(label=highest_gender, confidence=highest_confidence)


@app.post("/detect-fashion/", response_model=FashionResponse)
async def detect_fashion(file: UploadFile = File(...)):
    img = load_image_into_numpy_array(await file.read())
    class_list = ['bag', 'dress', 'hat', 'jacket', 'pants', 'shirt', 'shoe', 'shorts', 'skirt', 'sunglass']
    results = fashion_model(img)
    # detection information
    result = results[0]
    data = result.boxes
    labels = data.cls.tolist()
    detections = data.xyxy.numpy()
    cropped_images = []
    label=[]
    confidence=[]

    for i, detection in enumerate(detections):
        label_idx = int(labels[i])
        label.append(class_list[label_idx])
        
        # bounding box
        xmin, ymin, xmax, ymax = map(int, detection[:4])
        confidence.append(float(data.conf[i]))

        # Crop images
        cropped_img = img[ymin:ymax, xmin:xmax]
        _, encoded_img = cv2.imencode('.jpg', cropped_img)
        cropped_image_bytes = encoded_img.tobytes()

        cropped_image_base64 = base64.b64encode(cropped_image_bytes).decode('utf-8')

        cropped_images.append(cropped_image_base64)

    if not cropped_images:
        return FashionResponse(cropped_image=[None], label=None, confidence=0.0)

    # Trả về danh sách các ảnh đã cắt dưới dạng Base64
    return FashionResponse(cropped_image=cropped_images, label=label, confidence=confidence)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("YOLO_Fashion_API:app", host="127.0.0.1", port=8000, reload=True)