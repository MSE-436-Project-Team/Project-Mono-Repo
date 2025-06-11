# Project Mono-Repo

This is a monorepo containing both frontend and backend components of the project.

## Project Structure

```
.
├── frontend/     # React frontend (Vite) - Supports both JavaScript and TypeScript
└── backend/      # Python backend (FastAPI)
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
import React from 'react'

function Example() {
  return (
    <div>
      <h1>Hello from JavaScript!</h1>
    </div>
  )
}

export default Example
```

```tsx
// Example.tsx - TypeScript component
import React from 'react'

const Example: React.FC = () => {
  return (
    <div>
      <h1>Hello from TypeScript!</h1>
    </div>
  )
}

export default Example
```

Both approaches work seamlessly in the project. Choose the one that best fits your needs!

## Backend (Python + FastAPI)

The backend is built using FastAPI. To get started:

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
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`

## API Documentation

Once the backend server is running, you can access:
- Interactive API documentation (Swagger UI): `http://localhost:8000/docs`
- Alternative API documentation (ReDoc): `http://localhost:8000/redoc`

## Available Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint