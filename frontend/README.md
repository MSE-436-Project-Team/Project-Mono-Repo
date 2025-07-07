# NBA Fantasy Dashboard

A comprehensive React TypeScript dashboard for NBA fantasy league management with dynamic scoring weights and player projections.

## Features

- **Dynamic Fantasy Scoring**: Customize scoring weights for points, rebounds, assists, steals, blocks, and turnovers
- **Player Projections**: Real-time fantasy point calculations based on player statistics and recent performance
- **Interactive Dashboard**: Analytics, charts, and insights about player performance
- **Search & Filter**: Find players by name, team, or position
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install Additional Dependencies** (if not already installed):
   ```bash
   npm install recharts lucide-react clsx tailwind-merge
   npm install -D tailwindcss autoprefixer postcss
   ```

3. **Initialize Tailwind CSS**:
   ```bash
   npx tailwindcss init -p
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── DashboardStats.tsx      # Analytics and charts
│   ├── PlayerProjectionsTable.tsx  # Player rankings table
│   └── ScoringWeightsForm.tsx  # Custom scoring configuration
├── services/
│   └── mockData.ts            # Sample NBA data
├── types/
│   └── nba.ts                 # TypeScript interfaces
├── utils/
│   └── fantasyScoring.ts      # Fantasy point calculations
└── App.tsx                    # Main dashboard component
```

## Fantasy Scoring System

The dashboard supports customizable fantasy scoring with these default weights:

- **Points**: 1.0 fantasy point per point scored
- **Rebounds**: 1.2 fantasy points per rebound
- **Assists**: 1.5 fantasy points per assist
- **Steals**: 3.0 fantasy points per steal
- **Blocks**: 3.0 fantasy points per block
- **Turnovers**: -1.0 fantasy points per turnover

Users can customize these weights through the interactive form.

## Data Integration

Currently uses mock data. To connect to your backend:

1. Replace `mockPlayerStats` in `services/mockData.ts` with API calls
2. Update the data loading logic in `App.tsx`
3. Ensure your backend provides data in the expected format

## Technologies Used

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

## Development

- Run `npm run dev` for development server
- Run `npm run build` for production build
- Run `npm run lint` for code linting

## Future Enhancements

- Real-time data integration with NBA API
- Player comparison tools
- Draft assistance features
- League management tools
- Export functionality for projections
