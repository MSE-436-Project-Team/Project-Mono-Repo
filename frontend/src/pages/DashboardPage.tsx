import React, { useState, useEffect } from 'react';
import type { PlayerStats, ScoringWeights, ModelType } from '../types/nba';
import { DEFAULT_SCORING_WEIGHTS } from '../utils/fantasyScoring';
import {
  loadPlayerData,
  loadModelPredictions,
  combinePlayerDataWithPredictions,
  sortPlayersByFantasyPoints,
  filterPlayersByPosition,
  filterPlayersByTeam
} from '../services/nbaDataService';
import ModelSelector from '../components/ModelSelector';
import DashboardFilters from '../components/DashboardFilters';
import PlayerProjectionsTable from '../components/PlayerProjectionsTable';
import ScoringWeightsForm from '../components/ScoringWeightsForm';

const DashboardPage: React.FC = () => {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerStats[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>('ensemble_weighted');
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filter states
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [selectedModel]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [playerData, predictions] = await Promise.all([
        loadPlayerData(),
        loadModelPredictions(selectedModel)
      ]);
      const combinedPlayers = combinePlayerDataWithPredictions(
        playerData,
        predictions,
        selectedModel
      );
      const sortedPlayers = sortPlayersByFantasyPoints(combinedPlayers, scoringWeights);
      setPlayers(sortedPlayers);
      setFilteredPlayers(sortedPlayers);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...players];
    if (selectedPosition !== 'All') {
      filtered = filterPlayersByPosition(filtered, selectedPosition);
    }
    if (selectedTeam !== 'All') {
      filtered = filterPlayersByTeam(filtered, selectedTeam);
    }
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.DISPLAY_FIRST_LAST.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.TEAM_ABBREVIATION.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlayers(filtered);
  }, [players, selectedPosition, selectedTeam, searchTerm]);

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
  };

  const handleScoringWeightsChange = (weights: ScoringWeights) => {
    setScoringWeights(weights);
    const sortedPlayers = sortPlayersByFantasyPoints(players, weights);
    setPlayers(sortedPlayers);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-[#fef8f3] via-[#fff2eb] to-[#fbd1bb]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Themed header */}
        <div className="bg-gradient-to-r from-[#f6d8af] to-[#fbd1bb] px-8 py-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold text-[#7a4f2f]">📊 Player Projection Dashboard</h2>
          <p className="text-[#b77e6a] mt-2">Filter, sort, and compare players for your fantasy draft</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6 sticky top-4 self-start">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              isLoading={isLoading}
            />
            <DashboardFilters
              players={players}
              selectedPosition={selectedPosition}
              selectedTeam={selectedTeam}
              searchTerm={searchTerm}
              onPositionChange={setSelectedPosition}
              onTeamChange={setSelectedTeam}
              onSearchChange={setSearchTerm}
            />
            <ScoringWeightsForm
              weights={scoringWeights}
              onWeightsChange={handleScoringWeightsChange}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <PlayerProjectionsTable
              players={filteredPlayers}
              scoringWeights={scoringWeights}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 