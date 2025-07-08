import React from 'react';
import type { PlayerStats } from '../types/nba';
import { getUniqueTeams, getUniquePositions } from '../services/nbaDataService';

interface DashboardFiltersProps {
  players: PlayerStats[];
  selectedPosition: string;
  selectedTeam: string;
  searchTerm: string;
  onPositionChange: (position: string) => void;
  onTeamChange: (team: string) => void;
  onSearchChange: (search: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  players,
  selectedPosition,
  selectedTeam,
  searchTerm,
  onPositionChange,
  onTeamChange,
  onSearchChange
}) => {
  const teams = getUniqueTeams(players);
  const positions = getUniquePositions(players);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Players
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <select
            value={selectedPosition}
            onChange={(e) => onPositionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Positions</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => onTeamChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Players:</span>
              <span className="ml-2 font-medium">{players.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Teams:</span>
              <span className="ml-2 font-medium">{teams.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters; 