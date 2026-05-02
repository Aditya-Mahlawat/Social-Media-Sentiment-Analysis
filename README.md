# Social Media Sentiment Analysis Dashboard

> **Real-time NLP sentiment classification** (Positive / Neutral / Negative) for social media posts.

## Project Structure
```
Social-Media-Sentiment-Analysis/
├── data/
│   └── social_posts.parquet  # 20,000 synthetic posts with labels
├── notebooks/
│   └── 01_ingest.py
├── src/
│   ├── pipeline.py            # TF-IDF vectorizer (1000 features, unigrams+bigrams)
│   └── tune_optuna.py         # Optuna HPO + XGBoost multiclass
├── models/
│   └── sentiment_model.joblib
├── serving/
│   └── app.py                 # POST /analyze → sentiment, confidence, probabilities
├── apps/web/                  # Next.js live sentiment analyzer UI
└── venv/
```

## Quick Start

### 1. Generate Data & Train
```powershell
cd notebooks
..\venv\Scripts\python.exe 01_ingest.py

cd ..\src
..\venv\Scripts\python.exe tune_optuna.py
```

### 2. Run Backend
```powershell
cd serving
..\venv\Scripts\python.exe -m uvicorn app:app --port 8000 --reload
```

### 3. Run Frontend
```powershell
cd apps\web
C:\Program Files\nodejs\npm.cmd run dev
```

## API Reference

### POST /analyze
```json
{ "text": "This product is absolutely amazing!" }
```
**Response:**
```json
{
  "sentiment": "Positive",
  "confidence": 0.9998,
  "probabilities": {
    "Negative": 0.0001,
    "Neutral": 0.0001,
    "Positive": 0.9998
  }
}
```

## Tech Stack
- **ML**: TF-IDF + XGBoost (multiclass) + Optuna HPO
- **Backend**: FastAPI + Uvicorn
- **Frontend**: Next.js 16 with live text input + probability bars
- **Data**: Synthetic (20,000 posts, balanced 3-class)
