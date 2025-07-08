import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Navbar from './components/Navbar';
import HomeDashboardPage from './pages/HomeDashboardPage';
import DashboardPage from './pages/DashboardPage';
import CustomScoringPage from './pages/CustomScoringPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';
import PredictionPage from './pages/PredictionPage';
import './App.css';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeDashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scoring" element={<CustomScoringPage />} />
          <Route path="/player/:personId" element={<PlayerDetailsPage />} />
          <Route path="/predictions/:modelType" element={<PredictionPage />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
