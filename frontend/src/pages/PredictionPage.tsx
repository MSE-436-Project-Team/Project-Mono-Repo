import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MODEL_TYPES, getModelDisplayName, loadPlayerData, loadModelPredictions, combinePlayerDataWithPredictions, loadPlayerHistory, calculatePlayerFantasyPoints, sortPlayersByFantasyPoints } from '../services/nbaDataService';
import type { PlayerStats, ModelType } from '../types/nba';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ModelSelector from '../components/ModelSelector';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PAGE_SIZES = [10, 20, 50];

// Default fantasy scoring weights
const DEFAULT_WEIGHTS = {
  points: 1,
  rebounds: 1.2,
  assists: 1.5,
  steals: 2,
  blocks: 2,
  turnovers: -1,
  fieldGoalsMade: 0,
  fieldGoalsAttempted: 0,
  threePointsMade: 0,
  threePointsAttempted: 0,
  freeThrowsMade: 0,
  freeThrowsAttempted: 0,
  offensiveRebounds: 0,
  defensiveRebounds: 0,
  personalFouls: 0
};

const PredictionPage: React.FC = () => {
  const { modelType } = useParams<{ modelType: ModelType }>();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<ModelType>(modelType as ModelType || 'ensemble_weighted');
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [scoringWeights, setScoringWeights] = useState(DEFAULT_WEIGHTS);

  useEffect(() => {
    if (modelType && modelType !== selectedModel) {
      setSelectedModel(modelType as ModelType);
    }
    // eslint-disable-next-line
  }, [modelType]);

  // Load custom scoring weights from localStorage
  useEffect(() => {
    const savedWeights = localStorage.getItem('fantasyScoringWeights');
    if (savedWeights) {
      try {
        const weights = JSON.parse(savedWeights);
        setScoringWeights({ ...DEFAULT_WEIGHTS, ...weights });
      } catch (error) {
        console.error('Error loading scoring weights:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const playerData = await loadPlayerData();
      const predictions = await loadModelPredictions(selectedModel);
      const combined = combinePlayerDataWithPredictions(playerData, predictions, selectedModel);
      
      // Apply custom scoring and sort by fantasy points
      const sortedPlayers = sortPlayersByFantasyPoints(combined, scoringWeights);
      setPlayers(sortedPlayers);
      setIsLoading(false);
      setPage(1);
    };
    fetchData();
  }, [selectedModel, scoringWeights]);

  const handlePlayerClick = async (player: PlayerStats) => {
    setSelectedPlayer(player);
    setShowModal(true);
    setHistoryLoading(true);
    const hist = await loadPlayerHistory(player.PERSON_ID);
    setHistory(hist);
    setHistoryLoading(false);
  };

  const pagedPlayers = players.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(players.length / pageSize);

  // Prepare chart data (oldest to newest from left to right)
  const chartData = history.length > 0 ? {
    labels: history.map((row) => row.SEASON || row.SEASON_ID).reverse(),
    datasets: [
      {
        label: 'Points',
        data: history.map((row) => row.PTS || row.Points || 0).reverse(),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
      },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
          Player Projections
        </h1>
        <div className="mb-6">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={(model) => {
              setSelectedModel(model);
              navigate(`/predictions/${model}`);
            }}
            isLoading={isLoading}
          />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <label className="text-gray-700 dark:text-gray-200">Rows per page:</label>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Player</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Team</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Position</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Fantasy Points</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Minutes</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Points</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Rebounds</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Assists</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Steals</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Blocks</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">3 Pointers Made</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">3 Point Percentage</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Free Throw Percentage</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Field Goal Percentage</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200">Turnovers</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={12} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : pagedPlayers.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-8 text-gray-500">No players found.</td></tr>
              ) : (
                pagedPlayers.map(player => {
                  const fantasyPoints = calculatePlayerFantasyPoints(player, scoringWeights);
                  return (
                    <tr
                      key={player.PERSON_ID}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{player.DISPLAY_FIRST_LAST}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.TEAM_ABBREVIATION}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.POSITION}</td>
                      <td className="px-4 py-2 font-semibold text-blue-600 dark:text-blue-400">{fantasyPoints.toFixed(1)}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_Minutes !== undefined ? player.next_Minutes.toFixed(1) : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.Points ?? player.next_Points ?? '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.REB ?? player.next_REB ?? '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.AST ?? player.next_AST ?? '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.STL ?? player.next_STL ?? '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.BLK ?? player.next_BLK ?? '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_3PM !== undefined ? player.next_3PM.toFixed(1) : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{(player as any)["next_3P%"] !== undefined ? (player as any)["next_3P%"].toFixed(1) + '%' : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{(player as any)["next_FT%"] !== undefined ? (player as any)["next_FT%"].toFixed(1) + '%' : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{(player as any)["next_FG%"] !== undefined ? (player as any)["next_FG%"].toFixed(1) + '%' : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_TO !== undefined ? player.next_TO.toFixed(1) : '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-200">Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        {/* Player Detail Modal (expanded) */}
        {showModal && selectedPlayer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-200">{selectedPlayer.DISPLAY_FIRST_LAST}</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-2">Team: {selectedPlayer.TEAM_ABBREVIATION}</p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">Position: {selectedPlayer.POSITION}</p>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Fantasy Points: <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {calculatePlayerFantasyPoints(selectedPlayer, scoringWeights).toFixed(1)}
                </span>
              </p>
              {historyLoading ? (
                <div className="text-center py-8 text-gray-500">Loading history...</div>
              ) : history.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-100 mb-2">Points by Season</h3>
                    <Line data={chartData!} options={{ plugins: { legend: { display: false } } }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-100 mb-2">Career Stats</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="px-2 py-1">Season</th>
                            <th className="px-2 py-1">Team</th>
                            <th className="px-2 py-1">GP</th>
                            <th className="px-2 py-1">PTS</th>
                            <th className="px-2 py-1">REB</th>
                            <th className="px-2 py-1">AST</th>
                            <th className="px-2 py-1">STL</th>
                            <th className="px-2 py-1">BLK</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {history.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-2 py-1">{row.SEASON || row.SEASON_ID}</td>
                              <td className="px-2 py-1">{row.TEAM_ABBREVIATION}</td>
                              <td className="px-2 py-1">{row.GP || row.GAMES_PLAYED}</td>
                              <td className="px-2 py-1">{row.PTS || row.Points}</td>
                              <td className="px-2 py-1">{row.REB || row.REBOUNDS}</td>
                              <td className="px-2 py-1">{row.AST || row.ASSISTS}</td>
                              <td className="px-2 py-1">{row.STL || row.STEALS}</td>
                              <td className="px-2 py-1">{row.BLK || row.BLOCKS}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">No career history available.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage; 