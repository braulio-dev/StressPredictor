from fastapi import FastAPI
import joblib
from schemas import PredictionResponse
from schemas import CancerFeatures

app = FastAPI(title="Breast Cancer Diagnosis API", description="API for predicting breast cancer diagnosis based on tumor features")

model = joblib.load("breast_cancer_model.pkl")

@app.post("/predict", response_model=PredictionResponse)
def predict(features: CancerFeatures):
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
    confidence = model.predict_proba(data).max()
    return PredictionResponse(diagnosis=prediction, confidence=confidence)