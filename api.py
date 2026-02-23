from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
import random
from schemas import PredictionResponse
from schemas import CancerFeatures

app = FastAPI(title="Breast Cancer Diagnosis API", description="API for predicting breast cancer diagnosis based on tumor features")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "breast_cancer_model.pkl"
MOCK_MODE = not os.path.exists(MODEL_PATH)
model = None

if not MOCK_MODE:
    model = joblib.load(MODEL_PATH)
else:
    print("⚠️  Model not found — running in MOCK MODE. Train the model first to get real predictions.")

@app.get("/health")
def health():
    return {"status": "ok", "mock_mode": MOCK_MODE}

@app.post("/predict", response_model=PredictionResponse)
def predict(features: CancerFeatures):
    if MOCK_MODE:
        # Return fake result for UI testing only
        label = random.choice(["Benign", "Malignant"])
        confidence = round(random.uniform(0.75, 0.99), 4)
        return PredictionResponse(diagnosis=label, confidence=confidence)

    data = [[
        features.radius_worst,
        features.texture_worst,
        features.perimeter_worst,
        features.area_worst,
        features.smoothness_worst,
        features.compactness_worst,
        features.compactness_mean,
        features.concavity_worst,
        features.concavity_mean,
        features.concave_points_worst
    ]]
    prediction = model.predict(data)[0]
    confidence = float(model.predict_proba(data).max())
    label = "Benign" if prediction == 0 else "Malignant"
    return PredictionResponse(diagnosis=label, confidence=confidence)