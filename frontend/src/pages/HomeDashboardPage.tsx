import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MODEL_TYPES, getModelDisplayName } from '../services/nbaDataService';
import type { ModelType } from '../types/nba';
import { calculateFantasyPoints} from '../utils/fantasyScoring';
import {
  loadPlayerData,
  loadModelPredictions,
  combinePlayerDataWithPredictions,
  sortPlayersByFantasyPoints
} from '../services/nbaDataService';


const API_BASE_URL = 'http://localhost:8001';

const HomeDashboardPage: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

        const savedWeights = localStorage.getItem('fantasyScoringWeights');
        const weights = savedWeights ? JSON.parse(savedWeights) : null;

        try {
          const [playerData, predictions] = await Promise.all([
            loadPlayerData(),
            loadModelPredictions('ensemble_weighted')
          ]);

          let combined = combinePlayerDataWithPredictions(playerData, predictions, 'ensemble_weighted');

          // Calculate fantasy points for each player
          if (weights) {
            combined = combined.map(player => {
              const fantasyPoints = calculateFantasyPoints(player, weights);
              return { ...player, Points: fantasyPoints };
            }).sort((a, b) => b.Points - a.Points);
          } else {
            combined = combined.sort((a, b) => (b.Points ?? 0) - (a.Points ?? 0));
          }

          const top20 = combined.slice(0, 20);
          setTopPlayers(top20);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          setTopPlayers([]);
        }

        setLoading(false);
          };

    fetchData();
  }
  , []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);

  //     // Top players by points (ensemble_weighted)
  //     const topRes = await fetch(`${API_BASE_URL}/stats/top_players?stat=Points&model=ensemble_weighted&n=20`);
  //     const top = await topRes.json();

  //     setTopPlayers(top);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              NBA Fantasy Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the future of fantasy basketball with AI-powered player projections for the 2025-26 season
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/predictions/ensemble_weighted"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View All Predictions
              </Link>
              <Link
                to="/scoring"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
              >
                Custom Scoring
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Players Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">🏆 Top Projected Players</h2>
                <p className="text-blue-100 mt-2">Leading scorers for the 2025-26 season</p>
              </div>
              <div className="p-8">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {topPlayers.map((player, idx) => (
                    <div key={player.PERSON_ID} className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg mr-4">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">{player.DISPLAY_FIRST_LAST}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{player.TEAM_ABBREVIATION}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {player.Points?.toFixed(1) ?? player.Points ?? '-'}
                        </div>
                        {/* <div className="text-sm text-gray-500 dark:text-gray-400">PPG</div> */}
                        <div className="text-sm text-gray-500 dark:text-gray-400">Fantasy Pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Selection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">🤖 AI Models</h2>
                <p className="text-purple-100 mt-2">Choose your preferred prediction model</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto">
                  {MODEL_TYPES.map(model => (
                    <Link
                      key={model}
                      to={`/predictions/${model}`}
                      className="group p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 border border-purple-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-gray-500"
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          {getModelDisplayName(model)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          View Predictions →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDashboardPage; 