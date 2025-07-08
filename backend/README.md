# Backend (FastAPI, Python, ML)

This directory contains the backend for the NBA Fantasy Basketball Prediction Platform. It provides a FastAPI server that serves player data, model predictions, and analytics from CSV files and machine learning models.

## Directory Structure

```
backend/
├── api_service.py           # Main FastAPI app and API endpoints
├── requirements.txt         # Python dependencies
├── CSVs/                   # All raw data (players, boxscores, career stats, etc.)
├── Models/                 # Pre-trained (pre-trained models)
├── Output/                  # Model prediction CSVs (one per model)
├── TrainingAndTesting/     # Jupyter notebooks for model training/testing
├── DBManagement/           # (Optional) Supabase/DB client code
└── README.md               # (This file)
```

## Requirements
- Python 3.8+
- (Recommended) virtualenv or conda
- See `requirements.txt` for all dependencies (FastAPI, pandas, scikit-learn, torch, lightgbm, xgboost, pymc, etc.)

## Setup

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the API server:**
   ```bash
   uvicorn api_service:app --reload --port 8001
   ```
   The API will be available at http://localhost:8001

## Data Folders
- `CSVs/`: Place all player, boxscore, and career stats CSVs here. Example files:
  - `active_players.csv`
  - `career_stats.csv`
  - `boxscores_*.csv`
  - `season_features_*.csv`
- `Output/`: Place all model prediction CSVs here. Each file should match a model type (see below).

## Model Prediction Files
Each model's predictions should be a CSV in `Output/` with columns like:
- `PERSON_ID`, `SEASON_ID`, `INPUT_SEASON_ID`, `next_Points`, `next_REB`, ...

Supported model files (see `MODEL_FILES` in `api_service.py`):
- `bayesian_predictions.csv`
- `ridge_predictions.csv`
- `lightgbm_predictions.csv`
- `xgboost_predictions.csv`
- `lstm_predictions.csv`
- `transformer_predictions.csv`
- `ensemble_simple_predictions.csv`
- `ensemble_weighted_predictions.csv`
- `ensemble_stacking_predictions.csv`

## API Endpoints

- `GET /players` — List all active NBA players
- `GET /predictions/{model_type}` — Get predictions for a specific model
- `GET /player/{player_id}/history` — Get career stats for a player
- `GET /models/available` — List available models and their files
- `GET /stats/league` — League-wide stats
- `GET /stats/top_players?stat=Points&model=ensemble_weighted&n=5` — Top N players by stat
- `GET /stats/model_comparison?stat=Points` — Compare model averages
- `GET /` — Health check

## Adding a New Model
1. Add your model's prediction CSV to `Output/`.
2. Add the filename to `MODEL_FILES` in `api_service.py`.
3. (Optional) Add a display name/description in the frontend.

## Development
- All data is loaded from CSVs for reproducibility and transparency.
- Notebooks for model training/testing are in `TrainingAndTesting/`.
- API is stateless and easy to extend.

## Tips
- If you add new columns to your data, update the API and frontend as needed.
- Use the `/models/available` endpoint to debug missing or misnamed prediction files.

## License
MIT 
