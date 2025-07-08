import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MODEL_TYPES, getModelDisplayName } from '../services/nbaDataService';
import type { ModelType } from '../types/nba';

const API_BASE_URL = 'http://localhost:8001';

const HomeDashboardPage: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [modelAverages, setModelAverages] = useState<Record<ModelType, number>>({} as any);
  const [leagueStats, setLeagueStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Top players by points (ensemble_weighted)
      const topRes = await fetch(`${API_BASE_URL}/stats/top_players?stat=Points&model=ensemble_weighted&n=5`);
      const top = await topRes.json();
      setTopPlayers(top);
      // Model comparison (avg points)
      const modelRes = await fetch(`${API_BASE_URL}/stats/model_comparison?stat=Points`);
      const modelAvgs = await modelRes.json();
      setModelAverages(modelAvgs);
      // League-wide stats
      const leagueRes = await fetch(`${API_BASE_URL}/stats/league`);
      const league = await leagueRes.json();
      setLeagueStats(league);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-4 text-center">NBA Fantasy Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">Explore league-wide insights, top players, and compare model predictions for the 2025-26 season.</p>
        {loading ? (
          <div className="text-center text-gray-500">Loading metrics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Top Projected Players</h2>
              <ol className="space-y-2">
                {topPlayers.map((player, idx) => (
                  <li key={player.PERSON_ID} className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 dark:text-blue-300">#{idx + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{player.DISPLAY_FIRST_LAST}</span>
                    <span className="text-xs text-gray-500">{player.TEAM_ABBREVIATION}</span>
                    <span className="ml-auto text-blue-700 dark:text-blue-200 font-semibold">{player.Points?.toFixed(1) ?? player.Points ?? '-'}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Model Comparison (Avg. Points)</h2>
              <div className="flex flex-col gap-2">
                {MODEL_TYPES.map(model => (
                  <div key={model} className="flex items-center gap-3">
                    <span className="w-40 text-gray-800 dark:text-gray-200">{getModelDisplayName(model)}</span>
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900 rounded h-4 relative">
                      <div
                        className="bg-blue-500 dark:bg-blue-400 h-4 rounded"
                        style={{ width: `${Math.max(0, Math.min(100, (modelAverages[model] || 0) * 2))}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-700 dark:text-gray-100 font-semibold">{modelAverages[model]?.toFixed(1) ?? '-'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">League-Wide Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(leagueStats).map(([stat, val]: any) => (
                  <div key={stat} className="bg-blue-50 dark:bg-blue-900 rounded p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase">{stat}</div>
                    <div className="text-lg font-bold text-blue-800 dark:text-blue-100">{val.average?.toFixed(1) ?? '-'}</div>
                    <div className="text-xs text-gray-400">avg</div>
                    <div className="text-sm text-blue-700 dark:text-blue-200">{val.total?.toFixed(0) ?? '-'}</div>
                    <div className="text-xs text-gray-400">total</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-100">Quick Links</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {MODEL_TYPES.map(model => (
                  <Link
                    key={model}
                    to={`/predictions/${model}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {getModelDisplayName(model)} Predictions
                  </Link>
                ))}
                <Link
                  to="/scoring"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Custom Scoring
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDashboardPage; 