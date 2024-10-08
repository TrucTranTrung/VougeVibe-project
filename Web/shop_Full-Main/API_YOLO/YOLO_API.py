from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from PIL import Image
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
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
import requests
import os

# Cấu hình CORS
origins = [
    "http://localhost:3000",  # Địa chỉ frontend của bạn
]
app = FastAPI()
app.add_middleware( 
    CORSMiddleware, 
    allow_origin_regex="http://localhost:3000",  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], )
# Load model Fashion
fashion_model = YOLO("D:\\Model-Fashion\\E-Fas\\best.pt")
class_list = ['BAG', 'DRESS', 'HAT', 'JACKET', 'PANTS', 'SHIRT', 'SHOES', 'SHORT', 'SKIRT', 'SUNGLASS', 'HEADWEAR']
url_Images = "http://localhost:4000/allimages/detect"
nameImage_list = []
urlImage_list =[]

class FashionResponse(BaseModel):
    dataRes: List[dict]
    status: bool
    message: str

def load_image_into_numpy_array(data):
    image = Image.open(BytesIO(data))
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    return np.array(image)

def get_formatted_filename(url):
    filename_with_extension = os.path.basename(url)
    # Split filename and discard the numbers at the end, keep the first part and the extension
    name_parts = filename_with_extension.split('_')
    if '.' in name_parts[-1]:
        first_part = '_'.join(name_parts[:-1])  # Combine everything except the last number part
        extension = name_parts[-1].split('.')[-1]
        return f"{first_part}.{extension}"
    
    return filename_with_extension

@app.post("/api-detect", response_model=FashionResponse)
async def detect_gender(file: UploadFile = File(...)):
    #detect-gender
    try:
        img = load_image_into_numpy_array(await file.read())
        result_gender =  DeepFace.analyze(img, actions=['gender'])
    except Exception as e:
        return FashionResponse(dataRes=[], status=False, message=e)
    
    # Run gender model
    if isinstance(result_gender, list):
        result_gender = result_gender[0]

    gender_confidence = result_gender['gender']
    # IF CONFIDENCE < 0.5 => RESPONSE RELOAD NEW IMAGE
    if max(gender_confidence['Woman'], gender_confidence['Man']) <= 0.6 :
        return FashionResponse(dataRes=[], status=False, message="Confidence Gender <= 0.6")
    label_gender = "FEMALE" if gender_confidence['Woman'] > gender_confidence['Man'] else "MALE"
    
    #detect-fashion
    results = fashion_model(img)
    # detection information
    result_fashion = results[0]
    data = result_fashion.boxes
    labels = data.cls.tolist()
    detections = data.xyxy.numpy()
    cropped_images = []
    categorys = []

    for i, detection in enumerate(detections):
        label_idx = int(labels[i])
        xmin, ymin, xmax, ymax = map(int, detection[:4])

        fashion_confidence = float(data.conf[i])
        if fashion_confidence <= 0.6 :
            break
        # dataRes
        categorys.append(class_list[label_idx])

        # Crop images
        cropped_img = img[ymin:ymax, xmin:xmax]
        _, encoded_img = cv2.imencode('.jpg', cropped_img)
        cropped_image_bytes = encoded_img.tobytes()

        cropped_image_base64 = base64.b64encode(cropped_image_bytes).decode('utf-8')

        cropped_images.append(cropped_image_base64)

    if not cropped_images or not categorys:
        return FashionResponse(dataRes=[], status=False, message="Confidence fashion <= 0.6")
    
    try:
        # Gửi yêu cầu tới server bên ngoài
        response = requests.get(url_Images, json={"gender": label_gender, "category": categorys})
        Yolo_result =[] 
        if response.status_code == 200:
            serverResImg = response.json()
            Yolo_result.append({"categorys": categorys, "data": serverResImg})
            return FashionResponse(dataRes=Yolo_result, status=True, message="Success request")
        else:
            return FashionResponse(dataRes=[], status=False, message="Server not response")

    except Exception as e:
        return FashionResponse(dataRes=[], status=False, message=e)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("YOLO_API:app", host="127.0.0.1", port=8000, reload=True)