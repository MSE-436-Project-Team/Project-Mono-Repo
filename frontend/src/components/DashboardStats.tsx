import React from 'react';
import type { PlayerStats, PositionStats } from '../types/nba';

interface DashboardStatsProps {
  players: PlayerStats[];
  positionStats: Record<string, PositionStats>;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ players, positionStats }) => {
  const totalPlayers = players.length;
  
  // Use prediction data for analytics
  const playersWithPredictions = players.filter(p => p.next_Points !== undefined);
  const averagePredictedPoints = playersWithPredictions.length > 0 
    ? playersWithPredictions.reduce((sum, p) => sum + (p.next_Points || 0), 0) / playersWithPredictions.length 
    : 0;
  const averagePredictedRebounds = playersWithPredictions.length > 0 
    ? playersWithPredictions.reduce((sum, p) => sum + (p.next_REB || 0), 0) / playersWithPredictions.length 
    : 0;
  
  const topScorers = [...players]
    .filter(p => p.next_Points !== undefined)
    .sort((a, b) => (b.next_Points || 0) - (a.next_Points || 0))
    .slice(0, 5);
  
  const mostEfficient = [...players]
    .filter(p => p.next_GAME_EFFICIENCY !== undefined)
    .sort((a, b) => (b.next_GAME_EFFICIENCY || 0) - (a.next_GAME_EFFICIENCY || 0))
    .slice(0, 5);

  const positionBreakdown = Object.entries(positionStats).map(([position, stats]) => ({
    name: position,
    value: stats.playerCount,
    color: getPositionColor(position),
  }));

  const positionAverages = Object.entries(positionStats).map(([position, stats]) => ({
    position,
    avgPoints: stats.avgPoints,
    avgRebounds: stats.avgRebounds,
    avgAssists: stats.avgAssists,
    avgSteals: stats.avgSteals,
    avgBlocks: stats.avgBlocks,
  }));

  function getPositionColor(position: string): string {
    const colors = {
      'Guard': '#3b82f6',
      'Forward': '#10b981',
      'Center': '#f59e0b',
      'Other': '#6b7280',
    };
    return colors[position as keyof typeof colors] || '#6b7280';
  }

  return (
    <div className="space-y-6">
      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-900">Total Players</h3>
          <p className="text-3xl font-bold text-primary-600">{totalPlayers.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-900">Avg Predicted Points</h3>
          <p className="text-3xl font-bold text-primary-600">{averagePredictedPoints.toFixed(1)} PPG</p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-900">Avg Predicted Rebounds</h3>
          <p className="text-3xl font-bold text-primary-600">{averagePredictedRebounds.toFixed(1)} RPG</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Distribution</h3>
          <div className="space-y-3">
            {positionBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(entry.value / totalPlayers) * 100}%`,
                        backgroundColor: entry.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{entry.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Stats by Position */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Predicted Stats by Position</h3>
          <div className="space-y-4">
            {positionAverages.map((pos) => (
              <div key={pos.position} className="border-b border-gray-100 pb-3">
                <h4 className="font-medium text-gray-900 mb-2">{pos.position}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Points:</span>
                    <span className="ml-1 font-medium">{pos.avgPoints.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rebounds:</span>
                    <span className="ml-1 font-medium">{pos.avgRebounds.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assists:</span>
                    <span className="ml-1 font-medium">{pos.avgAssists.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Predicted Scorers</h3>
          <div className="space-y-3">
            {topScorers.map((player, index) => (
              <div key={player.PERSON_ID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{player.DISPLAY_FIRST_LAST}</p>
                    <p className="text-sm text-gray-600">{player.TEAM_ABBREVIATION} • {player.POSITION}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{(player.next_Points || 0).toFixed(1)}</p>
                  <p className="text-sm text-gray-600">PPG</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Efficient */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Predicted Efficient</h3>
          <div className="space-y-3">
            {mostEfficient.map((player, index) => (
              <div key={player.PERSON_ID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{player.DISPLAY_FIRST_LAST}</p>
                    <p className="text-sm text-gray-600">{player.TEAM_ABBREVIATION} • {player.POSITION}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{(player.next_GAME_EFFICIENCY || 0).toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 