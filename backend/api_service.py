from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import pandas as pd
import os
import simplejson as json

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
CSVS_DIR = os.path.join(BACKEND_DIR, "CSVs")
OUTPUT_DIR = os.path.join(BACKEND_DIR, "Output")

MODEL_FILES = {
    "bayesian": "bayesian_predictions.csv",
    "ridge": "ridge_predictions.csv",
    "lightgbm": "lightgbm_predictions.csv",
    "xgboost": "xgboost_predictions.csv",
    "lstm": "lstm_predictions.csv",  # Fixed: was pointing to transformer
    "transformer": "transformer_predictions.csv",
    "ensemble_simple": "ensemble_simple_predictions.csv",
    "ensemble_weighted": "ensemble_weighted_predictions.csv",
    "ensemble_stacking": "ensemble_stacking_predictions.csv",  # Added stacking ensemble
}

# Mapping from user-friendly stat names to model prediction columns
STAT_NAME_MAP = {
    'Points': 'next_Points',
    'FTM': 'next_FTM',
    'FTA': 'next_FTA',
    'FGM': 'next_FGM',
    'FGA': 'next_FGA',
    'TO': 'next_TO',
    'STL': 'next_STL',
    'BLK': 'next_BLK',
    'PF': 'next_PF',
    'USAGE_RATE': 'next_USAGE_RATE',
    'OREB': 'next_OREB',
    'DREB': 'next_DREB',
    'AST': 'next_AST',
    'REB': 'next_REB',
    'Minutes': 'next_Minutes',
    '3PM': 'next_3PM',
    '3PA': 'next_3PA',
    '3P%': 'next_3P%',
    'FT%': 'next_FT%',
    'FG%': 'next_FG%',
    'GAME_EFFICIENCY': 'next_GAME_EFFICIENCY',
}

def df_to_json_response(df):
    # Use simplejson to handle NaN and inf as null
    data = df.to_dict(orient="records")
    return JSONResponse(content=json.loads(json.dumps(data, ignore_nan=True)))

@app.get("/players")
def get_players():
    players_path = os.path.join(CSVS_DIR, "active_players.csv")
    if not os.path.exists(players_path):
        raise HTTPException(status_code=404, detail="Players file not found")
    df = pd.read_csv(players_path)
    return df_to_json_response(df)

@app.get("/predictions/{model_type}")
def get_predictions(model_type: str):
    model_file = MODEL_FILES.get(model_type)
    if not model_file:
        raise HTTPException(status_code=404, detail=f"Model type '{model_type}' not found")
    model_path = os.path.join(OUTPUT_DIR, model_file)
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail=f"Model predictions file '{model_file}' not found")
    df = pd.read_csv(model_path)
    print(f"[DEBUG] Loaded {model_type} predictions: {len(df)} rows")
    print(f"[DEBUG] Columns: {list(df.columns)}")
    return df_to_json_response(df)

@app.get("/models/available")
def get_available_models():
    """Get list of available models and their file status"""
    available_models = {}
    for model_type, filename in MODEL_FILES.items():
        model_path = os.path.join(OUTPUT_DIR, filename)
        available_models[model_type] = {
            "available": os.path.exists(model_path),
            "filename": filename
        }
    return available_models

@app.get("/player/{player_id}/history")
async def get_player_history(player_id: int):
    """Get career history for a specific player"""
    try:
        # Load career stats data
        career_stats_path = os.path.join(CSVS_DIR, "career_stats.csv")
        if not os.path.exists(career_stats_path):
            raise HTTPException(status_code=404, detail="Career stats data not found")
        
        df = pd.read_csv(career_stats_path)
        
        # Filter for the specific player (using PLAYER_ID column)
        player_history = df[df['PLAYER_ID'] == player_id].copy()
        
        if player_history.empty:
            raise HTTPException(status_code=404, detail="Player not found")
        
        # Sort by season (most recent first)
        player_history = player_history.sort_values('SEASON_ID', ascending=False)
        
        # Convert to list of dictionaries
        history_data = player_history.to_dict('records')
        
        return {
            "player_id": player_id,
            "history": history_data
        }
        
    except Exception as e:
        print(f"Error getting player history: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/stats/league")
def get_league_stats():
    # League-wide averages and totals for key stats from active_players.csv
    players_path = os.path.join(CSVS_DIR, "active_players.csv")
    if not os.path.exists(players_path):
        raise HTTPException(status_code=404, detail="Players file not found")
    df = pd.read_csv(players_path)
    stats = {}
    for stat in ["Points", "REB", "AST", "STL", "BLK", "TO", "FGM", "FGA", "3PM", "3PA", "FTM", "FTA", "OREB", "DREB", "PF"]:
        if stat in df.columns:
            stats[stat] = {
                "average": float(df[stat].mean()),
                "total": float(df[stat].sum())
            }
    return stats

@app.get("/stats/top_players")
def get_top_players(stat: str = Query(...), model: str = Query("ensemble_weighted"), n: int = Query(5)):
    model_file = MODEL_FILES.get(model)
    if not model_file:
        raise HTTPException(status_code=404, detail="Model type not found")
    model_path = os.path.join(OUTPUT_DIR, model_file)
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model predictions file not found")
    df = pd.read_csv(model_path)
    # Force PERSON_ID to int for merge
    df['PERSON_ID'] = df['PERSON_ID'].astype(int)
    players_path = os.path.join(CSVS_DIR, "active_players.csv")
    if not os.path.exists(players_path):
        raise HTTPException(status_code=404, detail="Players file not found")
    players_df = pd.read_csv(players_path)[["PERSON_ID", "DISPLAY_FIRST_LAST", "TEAM_ABBREVIATION"]]
    players_df['PERSON_ID'] = players_df['PERSON_ID'].astype(int)
    # Map stat name if needed
    stat_col = stat
    if stat not in df.columns and stat in STAT_NAME_MAP and STAT_NAME_MAP[stat] in df.columns:
        stat_col = STAT_NAME_MAP[stat]
    if stat_col not in df.columns:
        raise HTTPException(status_code=400, detail=f"Stat {stat} not found in model predictions")
    merged = df.merge(players_df, on="PERSON_ID", how="left")
    top = merged.nlargest(n, stat_col)[["PERSON_ID", "DISPLAY_FIRST_LAST", "TEAM_ABBREVIATION", stat_col]]
    top = top.rename(columns={stat_col: stat})
    return df_to_json_response(top)

@app.get("/stats/model_comparison")
def get_model_comparison(stat: str = Query("Points")):
    results = {}
    for model, filename in MODEL_FILES.items():
        model_path = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(model_path):
            df = pd.read_csv(model_path)
            stat_col = stat
            if stat not in df.columns and stat in STAT_NAME_MAP and STAT_NAME_MAP[stat] in df.columns:
                stat_col = STAT_NAME_MAP[stat]
            if stat_col in df.columns:
                results[model] = float(df[stat_col].mean())
            else:
                results[model] = None
        else:
            results[model] = None
    return results

# Health check
@app.get("/")
def root():
    return {"status": "ok", "message": "NBA Prediction API is running"} 