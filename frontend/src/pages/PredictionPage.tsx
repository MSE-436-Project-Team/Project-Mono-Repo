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

const COLUMN_DESCRIPTIONS: Record<string, string> = {
  PLAYER: 'Player name',
  TEAM: 'The NBA team abbreviation',
  POS: 'Player position (e.g., G, F, C).',
  TOTAL: 'Projected fantasy points based on your scoring settings.',
  MPG: 'Minutes per game',
  'FG%': 'Field goal percentage',
  'FT%': 'Free throw percentage',
  '3PM': '3 points made (per game)',
  PTS: 'Points per game',
  REB: 'Rebounds per game',
  AST: 'Assists per game',
  STL: 'Steals per game',
  BLK: 'Blocks per game',
  TO: 'Turnovers per game'
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
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');

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


  function getStatColor(
    value: number | null | undefined,
    thresholds: [number, string][]
  ): string {
    if (value == null) return 'bg-transparent';
    for (const [threshold, color] of thresholds) {
      if (value >= threshold) return color;
    }
    return 'bg-red-500 text-white';
  }

  function calculateStatThresholds(
    statValues: number[],
    colors: string[]
  ): [number, string][] {
    const mean = statValues.reduce((sum, val) => sum + val, 0) / statValues.length;
    const std = Math.sqrt(
      statValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / statValues.length
    );

    const steps = [3, 2, 1, 0, -1, -2, -3];
    return steps.map((s, i) => [mean + s * std, colors[i]]) as [number, string][];
  }

const colorSteps = [
  'bg-green-700 text-white',   // Dark green
  'bg-green-500 text-white',   // Medium green
  'bg-green-200 text-gray-800', // Pastel/light green
  '',                           // Neutral / No background
  'bg-red-200 text-gray-800',   // Pastel red
  'bg-red-500 text-white',      // Medium red
  'bg-red-700 text-white',      // Dark red
];

  const [rebThresholds, setRebThresholds] = useState<[number, string][]>([]);
  const [ptsThresholds, setPtsThresholds] = useState<[number, string][]>([]);
  const [astThresholds, setAstThresholds] = useState<[number, string][]>([]);
  const [stlThresholds, setStlThresholds] = useState<[number, string][]>([]);
  const [blkThresholds, setBlkThresholds] = useState<[number, string][]>([]);
  const [minThresholds, setMinThresholds] = useState<[number, string][]>([]);
  const [fgThresholds, setFgThresholds] = useState<[number, string][]>([]);
  const [ftThresholds, setFtThresholds] = useState<[number, string][]>([]);
  const [tpmThresholds, setTpmThresholds] = useState<[number, string][]>([]);
  const [toThresholds, setToThresholds] = useState<[number, string][]>([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const playerData = await loadPlayerData();
      const predictions = await loadModelPredictions(selectedModel);
      const combined = combinePlayerDataWithPredictions(playerData, predictions, selectedModel);

      const valid = combined.filter(p =>
        p.REB !== undefined &&
        p.Points !== undefined &&
        p.AST !== undefined &&
        p.STL !== undefined &&
        p.BLK !== undefined &&
        p.next_Minutes !== undefined &&
        p["FG%"] !== undefined &&
        p["FT%"] !== undefined &&
        p["3PM"] !== undefined &&
        p.TO !== undefined
      );
      const getVals = (key: keyof PlayerStats) => valid.map(p => p[key] as number);

      setRebThresholds(calculateStatThresholds(getVals('REB'), colorSteps));
      setPtsThresholds(calculateStatThresholds(getVals('Points'), colorSteps));
      setAstThresholds(calculateStatThresholds(getVals('AST'), colorSteps));
      setStlThresholds(calculateStatThresholds(getVals('STL'), colorSteps));
      setBlkThresholds(calculateStatThresholds(getVals('BLK'), colorSteps));
      setMinThresholds(calculateStatThresholds(getVals('next_Minutes'), colorSteps));
      setFgThresholds(calculateStatThresholds(getVals('FG%'), colorSteps));
      setFtThresholds(calculateStatThresholds(getVals('FT%'), colorSteps));
      setTpmThresholds(calculateStatThresholds(getVals('3PM'), colorSteps));
      setToThresholds(calculateStatThresholds(getVals('TO'), colorSteps));
      

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

  const sortedPlayers = React.useMemo(() => {
    if (!sortColumn) return players;
    // Use a copy to avoid mutating state
    const sorted = [...players];
    sorted.sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];
      // Handle undefined/null
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      // Numeric sort (descending)
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal;
      }
      // String sort (descending)
      return String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [players, sortColumn]);

  const filteredPlayers = React.useMemo(() => {
    let filtered = sortedPlayers;
    
    if (selectedPosition !== 'All') {
      filtered = filtered.filter(player => player.POSITION === selectedPosition);
    }
    
    if (selectedTeam !== 'All') {
      filtered = filtered.filter(player => player.TEAM_ABBREVIATION === selectedTeam);
    }
    
    return filtered;
  }, [sortedPlayers, selectedPosition, selectedTeam]);

  const pagedPlayers = filteredPlayers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredPlayers.length / pageSize);

  // function getStatColor(value: number | null | undefined, thresholds: [number, string][]) {
  //   if (value === null || value === undefined) return 'bg-transparent';
  //   for (const [threshold, color] of thresholds) {
  //     if (value >= threshold) return color;
  //   }
  //   return 'bg-red-500 text-white';
  // }

  //  // Example usage for REB:
  // const rebThresholds: [number, string][] = [
  //   [12, 'bg-green-600 text-white'],
  //   [9, 'bg-green-400 text-white'],
  //   [6, 'bg-yellow-200'],
  //   [3, 'bg-orange-300'],
  // ];

  // const ptsThresholds: [number, string][] = [
  //   [30, 'bg-green-600 text-white'],
  //   [22, 'bg-green-400 text-white'],
  //   [15, 'bg-yellow-200'],
  //   [8, 'bg-orange-300'],
  // ];

  // const astThresholds: [number, string][] = [
  //   [10, 'bg-green-600 text-white'],
  //   [7, 'bg-green-400 text-white'],
  //   [4, 'bg-yellow-200'],
  //   [2, 'bg-orange-300'],
  // ];

  // const stlThresholds: [number, string][] = [
  //   [2.5, 'bg-green-600 text-white'],
  //   [1.5, 'bg-green-400 text-white'],
  //   [1, 'bg-yellow-200'],
  //   [0.5, 'bg-orange-300'],
  // ];

  // const blkThresholds: [number, string][] = [
  //   [2.5, 'bg-green-600 text-white'],
  //   [1.5, 'bg-green-400 text-white'],
  //   [1, 'bg-yellow-200'],
  //   [0.5, 'bg-orange-300'],
  // ];


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

  function handleTooltipClick(column: string) {
    setOpenTooltip(openTooltip === column ? null : column);
  }

  function handleTooltipBlur(e: React.FocusEvent<HTMLButtonElement>, column: string) {
    // If focus moves outside the button and tooltip, close the tooltip
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpenTooltip(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#69392e] dark:text-blue-200 mb-6 text-center">
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
        
        {/* Filter Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 dark:text-gray-200">Position:</label>
            <select
              className="border rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedPosition}
              onChange={e => { setSelectedPosition(e.target.value); setPage(1); }}
            >
              <option value="All">All Positions</option>
              {[...new Set(players.map(player => player.POSITION))].sort().map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-gray-700 dark:text-gray-200">Team:</label>
            <select
              className="border rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedTeam}
              onChange={e => { setSelectedTeam(e.target.value); setPage(1); }}
            >
              <option value="All">All Teams</option>
              {[...new Set(players.map(player => player.TEAM_ABBREVIATION))].sort().map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
        </div>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
              <tr>
                {[
                  'RANK', 'PLAYER', 'TEAM', 'POS', 'TOTAL', 'MPG', 'FG%',
                  'FT%', '3PM', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO'
                ].map((col) => (
                  <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 relative">
                    <span className="inline-flex items-center gap-1">
                      {col === 'RANK' ? (
                        <span>{col}</span>
                      ) : (
                        <button
                          type="button"
                          className="hover:underline focus:outline-none"
                          onClick={() => setSortColumn(col)}
                          style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
                        >
                          {col}
                          {sortColumn === col && <span className="ml-1">▼</span>}
                        </button>
                      )}
                      {col !== 'RANK' && (
                        <button
                          type="button"
                          tabIndex={0}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          onClick={e => { e.stopPropagation(); handleTooltipClick(col); }}
                          onBlur={e => handleTooltipBlur(e, col)}
                        >
                          <span aria-label={`Info about ${col}`}>?</span>
                        </button>
                      )}
                    </span>
                    {openTooltip === col && (
                      <div className="absolute left-0 mt-2 w-56 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg p-2 text-xs text-gray-800 dark:text-gray-100" style={{ minWidth: '180px' }}>
                        {COLUMN_DESCRIPTIONS[col]}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={15} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : pagedPlayers.length === 0 ? (
                <tr><td colSpan={15} className="text-center py-8 text-gray-500">No players found.</td></tr>
              ) : (
                pagedPlayers.map((player, idx) => {
                  const fantasyPoints = calculatePlayerFantasyPoints(player, scoringWeights);
                  const globalRank = (page - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={player.PERSON_ID}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200 font-bold">{globalRank}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{player.DISPLAY_FIRST_LAST}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.TEAM_ABBREVIATION}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.POSITION}</td>
                      <td className="px-4 py-2 font-semibold text-[#b65e36] dark:text-orange-300">{fantasyPoints.toFixed(1)}</td>
                      {/* <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_Minutes !== undefined ? player.next_Minutes.toFixed(1) : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{(player as any)["next_FG%"] !== undefined ? (player as any)["next_FG%"].toFixed(1) + '%' : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{(player as any)["next_FT%"] !== undefined ? (player as any)["next_FT%"].toFixed(1) + '%' : '-'}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_3PM !== undefined ? player.next_3PM.toFixed(1) : '-'}</td> */}
                      <td className={`px-4 py-2 text-xs ${getStatColor(player.next_Minutes, minThresholds)}`}>{player.next_Minutes !== undefined ? player.next_Minutes.toFixed(1) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor((player as any)["next_FG%"], fgThresholds)}`}>{(player as any)["next_FG%"] !== undefined ? (player as any)["next_FG%"].toFixed(1) + '%' : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor((player as any)["next_FT%"], ftThresholds)}`}>{(player as any)["next_FT%"] !== undefined ? (player as any)["next_FT%"].toFixed(1) + '%' : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(player.next_3PM, tpmThresholds)}`}>{player.next_3PM !== undefined ? player.next_3PM.toFixed(1) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(typeof player.Points === 'number' ? player.Points : typeof player.next_Points === 'number' ? player.next_Points : null, ptsThresholds)}`}>{typeof (player.Points ?? player.next_Points) === 'number' ? (player.Points ?? player.next_Points).toFixed(2) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(typeof player.REB === 'number' ? player.REB : typeof player.next_REB === 'number' ? player.next_REB : null, rebThresholds)}`}>{typeof (player.REB ?? player.next_REB) === 'number' ? (player.REB ?? player.next_REB).toFixed(2) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(typeof player.AST === 'number' ? player.AST : typeof player.next_AST === 'number' ? player.next_AST : null, astThresholds)}`}>{typeof (player.AST ?? player.next_AST) === 'number' ? (player.AST ?? player.next_AST).toFixed(2) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(typeof player.STL === 'number' ? player.STL : typeof player.next_STL === 'number' ? player.next_STL : null, stlThresholds)}`}>{typeof (player.STL ?? player.next_STL) === 'number' ? (player.STL ?? player.next_STL).toFixed(2) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(typeof player.BLK === 'number' ? player.BLK : typeof player.next_BLK === 'number' ? player.next_BLK : null, blkThresholds)}`}>{typeof (player.BLK ?? player.next_BLK) === 'number' ? (player.BLK ?? player.next_BLK).toFixed(2) : '-'}</td>
                      <td className={`px-4 py-2 text-xs ${getStatColor(player.next_TO, toThresholds)}`}>{player.next_TO !== undefined ? player.next_TO.toFixed(1) : '-'}</td>
                      {/* <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{player.next_TO !== undefined ? player.next_TO.toFixed(1) : '-'}</td> */}
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
        <div className="flex items-center justify-center gap-2 mt-6">
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