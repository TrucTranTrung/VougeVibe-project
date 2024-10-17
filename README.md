# VougeVibe: Shop Full Project

**VougeVibe** is a web-based AI platform that recommends clothing products based on images or selfies uploaded by the user. It leverages YOLO for clothing detection, DeepFace for gender detection, and retrieves similar clothing products from the database.

## Table of Contents
1. Key Features
2. Tech Stack
3. Prerequisites
4. Setup Instructions
5. Future Development

## Features
- **Image Upload/Selfie**: Allows users to upload photos or take selfies for clothing recommendations.
- **Clothing Detection**: Uses **YOLO** to detect and categorize clothing items in images.
- **Gender Detection**: Uses **DeepFace** to identify the user's gender for more accurate recommendations.

## Tech Stack
- **Node.js**: Backend API and logic.
- **MongoDB**: Database for storing user and product data.
- **YOLO**: Deep learning model for clothing detection.
- **DeepFace**: Gender detection model.
- **Firebase**: For authentication and real-time data sync.
  
## Prerequisites
Ensure the following are installed on your local machine:
- **Node.js** (v14 or higher)
- **MongoDB** (v4 or higher)
- **Python** (v3.8 or higher)
- Installed YOLO and DeepFace models
- Contact `tructran172003@gmail.com` for API models.

## Setup Instructions

### Step 1: Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/HaiDaEmVang/shop_Full.git
cd shop_Full
```

### Step 2: Download and Configure API Models
Run the following command to install dependencies:
```bash
# Load Fashion model
path_fashion_model = "../best.pt"  
path_label_model = "../labels.npy"  
path_saved_features = "../saved_features.npy"
```


### Step 3: Add Firebase Configuration
- In the backend folder, paste the fireBaseLog.json file containing your Firebase credentials for user authentication and real-time database operations.
- The best.pt file is the trained YOLO model that detects and categorizes fashion items in images.
- The labels.npy and saved_features.npy file are the featues extraction file of database using RESNET50.

### Step 4: Start the Application
Create 3 terminals to run the backend, frontend, and admin services:
Terminal 1: Start Backend
```bash
cd backend
npm install
node index.js
```
Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run start
```
Terminal 3: Start Admin Panel
```bash
cd admin
npm install
npm run start
```

### Step 5: Start YOLO_API
## Future Development
VougeVibe will continue to improve with the following enhancements:
* Optimization of Recommendation Speed: Reducing response times to ensure a faster recommendation process.
* Enhanced Fashion Detection Models: Upgrading the YOLO model for more accurate detection and a wider variety of fashion products.
* Increased Product Diversity: Expanding the product database to include more fashion styles, providing more diverse recommendations.
* Improved Image Retrieval: Refining the image retrieval system for more precise recommendations, enhancing feature extraction and cosine similarity for better product matching.

