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
import requests
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import torch.nn.functional as F


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
# Load model Fashion
fashion_model = YOLO("D:\\GITHUB\\Vouge\\Model-Fashion\\E-Fas\\best.pt")
# Load the processor and model
processor = AutoImageProcessor.from_pretrained("rizvandwiki/gender-classification")
model = AutoModelForImageClassification.from_pretrained("rizvandwiki/gender-classification")
# Load model person detection
person_model=YOLO("yolov8n.pt")

class FashionResponse(BaseModel):
    label_Gender: str
    confidence_Gender: float
    cropped_image: List[Optional[str]]
    label_Fashion: List[str]
    confidence_Fashion: List[float]


def load_image_into_numpy_array(data):
    return np.array(Image.open(BytesIO(data)))

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

# Function detect person
def detect_person(image):
    # Ensure the image is in RGB format
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Run YOLOv8 detection
    results = person_model(image_rgb)
    # Check for detections of class 'person'
    person_class_id = list(person_model.names.keys())[list(person_model.names.values()).index("person")]
    
    for result in results:
        for box in result.boxes:
            if int(box.cls) == int(person_class_id):
                confidence = float(box.conf) 
                print(confidence)
                return True, confidence 
    return False, 0.0

@app.post("/detect-fashion/", response_model=FashionResponse)
async def detect_fashion(file: UploadFile = File(...)):
    img = load_image_into_numpy_array(await file.read())
    result_person, confidence_person =detect_person(img)
    
    if result_person==True and confidence_person>0.5:
        inputs = processor(images=img, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        # Apply softmax to get probabilities
        probabilities = F.softmax(outputs.logits, dim=1)
        # Define label map for interpreting the output
        label_map = {0: "Female", 1: "Male"}
        # Get the predicted class index and confidence
        predicted_class_idx = torch.argmax(probabilities, dim=1).item()
        predicted_label = label_map[predicted_class_idx]
        confidence_gen = probabilities[0, predicted_class_idx].item()

        class_list = ['bag', 'dress', 'hat', 'jacket', 'pants', 'shirt', 'shoe', 'shorts', 'skirt', 'sunglass']
        results = fashion_model(img)
        # detection information
        result_fas = results[0]
        data = result_fas.boxes
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
            cropped_images = [None]
            label = ["No Fashion Detected"]
            confidence_fashion = [0.0]

        # Trả về danh sách các ảnh đã cắt dưới dạng Base64
        return FashionResponse(
        label_Gender=predicted_label, 
        confidence_Gender=confidence_gen, 
        cropped_image=cropped_images, 
        label_Fashion=label, 
        confidence_Fashion=confidence
        )
    else:
        return FashionResponse(
        label_Gender="Not Human", 
        confidence_Gender=0.0, 
        cropped_image=[None], 
        label_Fashion=["No Fashion Detected"], 
        confidence_Fashion=[0.0]
        ) 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("YOLO_Fashion_API:app", host="127.0.0.1", port=8000, reload=True)