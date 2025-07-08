# NBA Fantasy Basketball Dashboard

A comprehensive dashboard for NBA fantasy basketball that displays player projections for the 2025-26 season using advanced machine learning models.

## Features

- **Multiple ML Models**: Switch between 8 different machine learning models including Bayesian Regression, Ridge Regression, LightGBM, XGBoost, LSTM, Transformer, and Ensemble methods
- **Real Player Data**: Loads actual NBA player data from CSV files via FastAPI backend
- **Fantasy Points Calculation**: Customizable scoring weights for fantasy basketball leagues
- **Advanced Filtering**: Filter players by position, team, and search by name
- **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS
- **FastAPI Backend**: High-performance Python backend serving data from CSV files

## Available Models

1. **Bayesian Regression** - Probabilistic model with uncertainty quantification
2. **Ridge Regression** - Linear regression with L2 regularization
3. **LightGBM** - Gradient boosting framework optimized for speed
4. **XGBoost** - Extreme gradient boosting with advanced regularization
5. **LSTM Neural Network** - Long Short-Term Memory for sequential patterns
6. **Transformer** - Attention-based neural network architecture
7. **Simple Ensemble** - Average of all individual model predictions
8. **Weighted Ensemble** - Weighted average based on model performance

## Fantasy Basketball Statistics

The dashboard supports all major fantasy basketball statistics:
- **Points** - Points scored
- **Rebounds** - Total rebounds (Offensive + Defensive)
- **Assists** - Assists
- **Steals** - Steals
- **Blocks** - Blocks
- **Turnovers** - Turnovers (negative points)
- **Field Goals Made/Attempted** - Shooting efficiency
- **3-Pointers Made/Attempted** - Long-range shooting
- **Free Throws Made/Attempted** - Free throw efficiency
- **Offensive Rebounds** - Offensive boards
- **Defensive Rebounds** - Defensive boards
- **Personal Fouls** - Fouls (negative points)

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **FastAPI** - High-performance Python web framework
- **Pandas** - Data manipulation and CSV reading
- **Uvicorn** - ASGI server for FastAPI

### Data Sources
- **Active Players** - Current NBA player roster
- **Model Predictions** - 2025-26 season projections from 8 ML models
- **Career Statistics** - Historical player performance data

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ with pip
- Git

### Backend Setup (FastAPI)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   uvicorn api_service:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The dashboard will be available at `http://localhost:5173`

## API Endpoints

### FastAPI Backend (`http://localhost:8000`)

- `GET /players` - Get all active NBA players
- `GET /predictions/{model_type}` - Get predictions for a specific model
- `GET /player/{person_id}/history` - Get career statistics for a player
- `GET /` - Health check endpoint

### Available Model Types
- `bayesian` - Bayesian Regression predictions
- `ridge` - Ridge Regression predictions
- `lightgbm` - LightGBM predictions
- `xgboost` - XGBoost predictions
- `lstm` - LSTM Neural Network predictions
- `transformer` - Transformer predictions
- `ensemble_simple` - Simple Ensemble predictions
- `ensemble_weighted` - Weighted Ensemble predictions

## Usage

1. **Select a Model**: Choose from 8 different ML models to view their predictions
2. **Customize Scoring**: Adjust fantasy points weights for different statistics
3. **Filter Players**: Use position, team, and search filters to find specific players
4. **View Projections**: See predicted statistics for the 2025-26 season
5. **Calculate Fantasy Points**: View calculated fantasy points based on your scoring system

## Development

### Project Structure
```
Project-Mono-Repo/
├── backend/
│   ├── api_service.py          # FastAPI service
│   ├── CSVs/                   # Player and historical data
│   ├── Output/                 # Model predictions
│   └── TrainingAndTesting/     # ML model notebooks
└── frontend/
    ├── src/
    │   ├── components/         # React components
    │   ├── services/           # API service calls
    │   ├── types/              # TypeScript interfaces
    │   └── utils/              # Utility functions
    └── package.json
```

### Adding New Models
1. Add prediction CSV to `backend/Output/`
2. Update `MODEL_FILES` in `backend/api_service.py`
3. Add model type to `MODEL_TYPES` in frontend service
4. Update model display names and descriptions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
