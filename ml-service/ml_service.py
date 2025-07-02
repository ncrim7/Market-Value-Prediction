import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import joblib
import numpy as np
from pymongo import MongoClient
from datetime import datetime

# Environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://cirim12:WZo4jHANAHxj620H@mvpcluster.ncqo3eb.mongodb.net/?retryWrites=true&w=majority&appName=mvpcluster")

MODEL_PATH = os.getenv("MODEL_PATH", "xgboost_model_mvp.pkl")

# FastAPI app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
client = MongoClient(MONGO_URI)
mongo_db = client["football_predictor"]
predictions_collection = mongo_db["predictions"]

# Model loading
model = None
model_version = "unknown"
feature_names = [
    'Yaş', 'Maç', 'Gol', 'Asist', 'Şut_Maç', 'İsabetli_Şut_Maç', 'Pas',
    'Dribbling_Maç', 'Top_Kazanma_Maç', 'Hava_Topu_Kazanma_Maç',
    'İkili_Mücadele_Kazanma_Maç', 'Başarılı_Pas_Maç', 'İsabetli_Orta_Maç',
    'Ülke_encoded', 'Takım_encoded', 'Pozisyon_encoded'
]
def load_model():
    global model, model_version
    try:
        model = joblib.load(MODEL_PATH)
        model_version = getattr(model, 'version', '1.0')
        print(f"✅ Model yüklendi: {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Model yüklenemedi: {e}")
        model = None
        model_version = "not_loaded"

load_model()

# Pydantic input model
class PredictionInput(BaseModel):
    Yaş: float = Field(..., ge=16, le=45)
    Maç: float = Field(..., ge=0)
    Gol: float = Field(..., ge=0)
    Asist: float = Field(..., ge=0)
    Şut_Maç: float = Field(..., ge=0)
    İsabetli_Şut_Maç: float = Field(..., ge=0)
    Pas: float = Field(..., ge=0, le=100)
    Dribbling_Maç: float = Field(..., ge=0)
    Top_Kazanma_Maç: float = Field(..., ge=0)
    Hava_Topu_Kazanma_Maç: float = Field(..., ge=0)
    İkili_Mücadele_Kazanma_Maç: float = Field(..., ge=0, le=100)
    Başarılı_Pas_Maç: float = Field(..., ge=0)
    İsabetli_Orta_Maç: float = Field(..., ge=0)
    Ülke_encoded: float = Field(..., ge=0)
    Takım_encoded: float = Field(..., ge=0)
    Pozisyon_encoded: float = Field(..., ge=0)

class PredictionOutput(BaseModel):
    predicted_market_value: float
    confidence_score: Optional[float] = None
    model_version: str
    processing_time_ms: Optional[float] = None
    feature_importance: Optional[dict] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ML servis çalışıyor!"}

@app.get("/model/info")
def model_info():
    return {
        "model_version": model_version,
        "model_loaded": model is not None,
        "feature_names": feature_names
    }

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    import time
    start = time.time()
    if model is None:
        raise HTTPException(status_code=503, detail="Model yüklenemedi.")
    input_data = data.dict()
    features = np.array([input_data[f] for f in feature_names]).reshape(1, -1)
    try:
        prediction_log = model.predict(features)[0]
        market_value = float(np.expm1(prediction_log))
        # Dummy confidence ve feature importance
        confidence = 0.85
        feature_importance = getattr(model, 'feature_importances_', None)
        # MongoDB'ye kaydet
        record = input_data.copy()
        record['predicted_market_value'] = market_value
        record['model_version'] = model_version
        record['created_at'] = datetime.utcnow()
        predictions_collection.insert_one(record)
        processing_time = (time.time() - start) * 1000
        return PredictionOutput(
            predicted_market_value=market_value,
            confidence_score=confidence,
            model_version=model_version,
            processing_time_ms=processing_time,
            feature_importance={str(i): float(val) for i, val in enumerate(feature_importance)} if feature_importance is not None else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tahmin sırasında hata: {e}") 
