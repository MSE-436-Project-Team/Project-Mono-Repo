import React, { useState, useEffect } from 'react';
import type { ScoringWeights, FantasyProjection, PlayerStats } from './types/nba';
import { generateFantasyProjections, getAverageStatsByPosition } from './utils/fantasyScoring';
import { mockPlayerStats, mockScoringWeights, getMockPositionStats } from './services/mockData';
import ScoringWeightsForm from './components/ScoringWeightsForm';
import PlayerProjectionsTable from './components/PlayerProjectionsTable';
import DashboardStats from './components/DashboardStats';
import './App.css';

// Simple SVG Icons
const BasketballIcon = () => (
  <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.55c-.32.48-.5 1.01-.5 1.56V18h2m-8-2c0-1.1.9-2 2-2s2 .9 2 2v4H8v-4zm-2-2c.8 0 1.54-.37 2.01-1l1.7-2.55c.32-.48.5-1.01.5-1.56V6c0-1.1-.9-2-2-2s-2 .9-2 2v4.89c0 .55.18 1.08.5 1.56L9.99 15c.47.63 1.21 1 2.01 1z"/>
  </svg>
);

const TrophyIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

function App() {
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(mockScoringWeights);
  const [projections, setProjections] = useState<FantasyProjection[]>([]);
  const [players, setPlayers] = useState<PlayerStats[]>(mockPlayerStats);
  const [positionStats, setPositionStats] = useState<Record<string, any>>(getMockPositionStats());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projections' | 'settings'>('dashboard');

  // Generate projections when scoring weights change
  useEffect(() => {
    const newProjections = generateFantasyProjections(players, scoringWeights);
    setProjections(newProjections);
  }, [scoringWeights, players]);

  // Update position stats when players change
  useEffect(() => {
    const newPositionStats = getAverageStatsByPosition(players);
    setPositionStats(newPositionStats);
  }, [players]);

  const handlePlayerClick = (projection: FantasyProjection) => {
    console.log('Player clicked:', projection);
    // Could open a detailed player modal here
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BasketballIcon },
    { id: 'projections', label: 'Projections', icon: TrendingUpIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BasketballIcon />
                <h1 className="text-2xl font-bold text-gray-900">NBA Fantasy Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UsersIcon />
                <span>{players.length} Players</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrophyIcon />
                <span>Fantasy League</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">
                Comprehensive analytics and insights for your NBA fantasy league
              </p>
            </div>
            
            <DashboardStats 
              players={players} 
              positionStats={positionStats} 
            />
          </div>
        )}

        {activeTab === 'projections' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Fantasy Projections</h2>
              <p className="text-gray-600">
                Player rankings and projected fantasy points based on your custom scoring system
              </p>
            </div>

            <ScoringWeightsForm 
              weights={scoringWeights}
              onWeightsChange={setScoringWeights}
            />

            <PlayerProjectionsTable 
              projections={projections}
              onPlayerClick={handlePlayerClick}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">
                Configure your fantasy league settings and data preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source</h3>
                <p className="text-gray-600 mb-4">
                  Currently using mock data. Connect to your backend API to load real NBA data.
                </p>
                <button className="btn-primary">
                  Connect to Backend
                </button>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                <p className="text-gray-600 mb-4">
                  Export projections and analytics for your fantasy league.
                </p>
                <div className="space-y-2">
                  <button className="btn-secondary w-full">
                    Export Projections (CSV)
                  </button>
                  <button className="btn-secondary w-full">
                    Export Analytics (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>NBA Fantasy Dashboard • Built with React & TypeScript</p>
            <p className="text-sm mt-2">
              Data powered by NBA statistics • Fantasy scoring calculations included
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
