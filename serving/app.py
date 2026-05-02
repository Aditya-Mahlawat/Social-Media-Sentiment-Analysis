from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("../models/sentiment_model.joblib")
MAP = {0: "Negative", 1: "Neutral", 2: "Positive"}

class Post(BaseModel):
    text: str

@app.post("/analyze")
def analyze(post: Post):
    df = pd.Series([post.text])
    
    probs = model.predict_proba(df)[0]
    pred = int(probs.argmax())
    
    return {
        "sentiment": MAP[pred],
        "confidence": float(probs.max()),
        "probabilities": {MAP[i]: float(probs[i]) for i in range(3)}
    }
