from pydantic import BaseModel, Field

class CancerFeatures(BaseModel):
    radius_worst: float = Field(..., description="Worst radius of the tumor")
    texture_worst: float = Field(..., description="Worst texture of the tumor")
    perimeter_worst: float = Field(..., description="Worst perimeter of the tumor")
    area_worst: float = Field(..., description="Worst area of the tumor")
    smoothness_worst: float = Field(..., description="Worst smoothness of the tumor")
    compactness_worst: float = Field(..., description="Worst compactness of the tumor")
    compactness_mean: float = Field(..., description="Mean compactness of the tumor")
    concavity_worst: float = Field(..., description="Worst concavity of the tumor")
    concavity_mean: float = Field(..., description="Mean concavity of the tumor")
    concave_points_worst: float = Field(..., description="Worst concave points of the tumor")

class PredictionResponse(BaseModel):
    diagnosis: str = Field(..., description="Predicted diagnosis of the tumor (benign or malignant)")
    confidence: float = Field(..., description="Confidence score of the prediction")