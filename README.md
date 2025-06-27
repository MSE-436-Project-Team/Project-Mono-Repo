# Project Mono-Repo

This is a monorepo containing frontend and backend components of the project.

## Project Structure

```
.
├── frontend/     # React frontend (Vite) - Supports both JavaScript and TypeScript
├── backend/      # Python backend service (FastAPI + API Gateway)
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality (database, config)
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic services
│   │   └── main.py       # FastAPI application
│   └── requirements.txt  # Python dependencies
├── .env          # Environment variables (create this file)
└── .gitignore    # Git ignore rules
```

## Git Setup and Workflow

### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd Project-Mono-Repo
   ```

2. **Create and configure your .env file:**

   ```bash
   cp .env.example .env  # if .env.example exists
   # Edit .env with your configuration
   ```

3. **Initial commit (if starting fresh):**
   ```bash
   git add .
   git commit -m "Initial project setup"
   git push origin main
   ```

### Daily Development Workflow

1. **Start your day:**

   ```bash
   git pull origin main
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit:**

   ```bash
   git add .
   git commit -m "Add feature description"
   ```

4. **Push your branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request** (on GitHub/GitLab) or merge locally:
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

### Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View changes in a file
git diff filename

# Stash changes temporarily
git stash
git stash pop

# Reset to last commit
git reset --hard HEAD

# View all branches
git branch -a

# Switch branches
git checkout branch-name

# Delete a branch
git branch -d branch-name
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_db

# Service Ports
BACKEND_PORT=8001
FRONTEND_PORT=5173

# Service Hosts
BACKEND_HOST=0.0.0.0

# Service URLs
BACKEND_URL=http://localhost:8001
FRONTEND_URL=http://localhost:5173
```

## Quick Start

To run all services together:

1. **Start the Backend:**

   ```bash
   cd backend
   python -m venv backend_venv
   source backend_venv/bin/activate  # On Windows: backend_venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Frontend (React)

The frontend is built using Vite and React, with support for both JavaScript and TypeScript. You can use either language based on your preference:

- Use `.jsx` files for JavaScript React components
- Use `.tsx` files for TypeScript React components
- Mix and match both in the same project

To get started:

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Frontend Development

You can create new components using either JavaScript or TypeScript:

```jsx
// Example.jsx - JavaScript component
import React from "react";

function Example() {
  return (
    <div>
      <h1>Hello from JavaScript!</h1>
    </div>
  );
}

export default Example;
```

```tsx
// Example.tsx - TypeScript component
import React from "react";

const Example: React.FC = () => {
  return (
    <div>
      <h1>Hello from TypeScript!</h1>
    </div>
  );
};

export default Example;
```

Both approaches work seamlessly in the project. Choose the one that best fits your needs!

## Backend (Python + FastAPI)

The backend service combines both API gateway and business logic functionality. It's organized into modules for better code structure:

- **API Gateway**: Handles CORS, routing, and request/response processing
- **Business Logic**: Core application functionality and data processing
- **Database**: SQLAlchemy ORM with PostgreSQL support

To get started:

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

The backend will be available at `http://localhost:8001`

### Backend Structure

```
backend/app/
├── api/          # API endpoints and routes
├── core/         # Core functionality (database, config)
├── models/       # Database models
├── services/     # Business logic services
└── main.py       # FastAPI application entry point
```

## API Documentation

Once the backend server is running, you can access:

- Interactive API documentation (Swagger UI): `http://localhost:8001/docs`
- Alternative API documentation (ReDoc): `http://localhost:8001/redoc`

## Available Endpoints

### Backend Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
- `GET /api/users`: Get all users
- `GET /api/users/{user_id}`: Get specific user
- `POST /api/users`: Create new user
- `GET /api/data`: Get business data

## Development Notes

- All services read environment variables from the root `.env` file
- The backend combines API gateway and business logic in a single service
- CORS is configured to allow frontend communication
- Virtual environments are used for Python dependencies isolation
- The frontend supports both JavaScript and TypeScript components
- Database support with SQLAlchemy and PostgreSQL
- Organized backend structure with separate modules for different concerns
