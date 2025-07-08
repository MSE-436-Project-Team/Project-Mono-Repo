# NBA Fantasy Basketball Prediction Platform

This is a monorepo for a full-stack NBA fantasy basketball analytics and prediction platform. It features a React/TypeScript frontend and a FastAPI/Python backend, supporting advanced machine learning models for player projections, custom fantasy scoring, and interactive analytics.

## Project Structure

```
Project-Mono-Repo/
├── backend/      # FastAPI backend, ML models, and data
│   ├── api_service.py
│   ├── CSVs/                # Player, boxscore, and model data (CSV)
│   ├── Models/                 # Pre-trained (pre-trained models)
│   ├── Output/              # Model prediction CSVs
│   ├── TrainingAndTesting/  # Jupyter notebooks for ML models
│   ├── requirements.txt
│   └── README.md            # Backend-specific setup & docs
├── frontend/     # React + TypeScript + Tailwind CSS dashboard
│   ├── src/
│   ├── package.json
│   └── README.md            # Frontend-specific setup & docs
├── ploty-dash-frontend/     # (Optional) Plotly Dash analytics (Python)
├── README.md                # (This file) Project overview & quick start
```

## Requirements
- Python 3.8+
- Node.js 18+
- npm
- (Recommended) virtualenv or conda for Python

## Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api_service:app --reload --port 8001
```
The API will be available at http://localhost:8001

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at http://localhost:5173

## Folder Details
- **backend/**: All Python code, data, and ML models. See `backend/README.md` for details.
- **frontend/**: All React/TypeScript code for the dashboard. See `frontend/README.md` for details.
- **ploty-dash-frontend/**: (Optional) Python Plotly Dash analytics app.

## Data & Models
- Place all CSV data in `backend/CSVs/`.
- Place all model prediction CSVs in `backend/Output/`.
- See backend/README.md for details on supported files and formats.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes and test
4. Submit a pull request

## License
MIT

---
See `backend/README.md` and `frontend/README.md` for detailed setup, usage, and development instructions for each part of the project.
