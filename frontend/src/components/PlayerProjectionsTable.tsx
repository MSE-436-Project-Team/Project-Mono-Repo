import React, { useState } from 'react';
import type { FantasyProjection } from '../types/nba';

interface PlayerProjectionsTableProps {
  projections: FantasyProjection[];
  onPlayerClick?: (projection: FantasyProjection) => void;
}

const PlayerProjectionsTable: React.FC<PlayerProjectionsTableProps> = ({ 
  projections, 
  onPlayerClick 
}) => {
  const [sortBy, setSortBy] = useState<keyof FantasyProjection>('projectedFantasyPoints');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof FantasyProjection) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedProjections = projections
    .filter(projection => {
      const matchesPosition = positionFilter === 'ALL' || projection.player.POSITION_CATEGORY === positionFilter;
      const matchesSearch = projection.player.DISPLAY_FIRST_LAST.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           projection.player.TEAM_ABBREVIATION.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPosition && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
      }
      
      return 0;
    });

  const positions = ['ALL', ...Array.from(new Set(projections.map(p => p.player.POSITION_CATEGORY)))];

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Players</label>
          <input
            type="text"
            placeholder="Search by name or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="input-field"
          >
            {positions.map(position => (
              <option key={position} value={position}>
                {position === 'ALL' ? 'All Positions' : position}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rank')}>
                Rank
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('player')}>
                Player
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('player')}>
                Team
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('player')}>
                Pos
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('projectedFantasyPoints')}>
                Proj. FP
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. PTS</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. REB</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. AST</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. STL</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. BLK</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Proj. TO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedProjections.map((projection) => (
              <tr 
                key={projection.player.PERSON_ID}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onPlayerClick?.(projection)}
              >
                <td className="px-3 py-2 font-medium text-gray-900">
                  #{projection.rank}
                </td>
                <td className="px-3 py-2 font-medium text-gray-900">
                  {projection.player.DISPLAY_FIRST_LAST}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.player.TEAM_ABBREVIATION}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.player.POSITION_CATEGORY}
                </td>
                <td className="px-3 py-2 font-semibold text-primary-600">
                  {projection.projectedFantasyPoints.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.points.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.rebounds.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.assists.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.steals.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.blocks.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {projection.projectedStats.turnovers.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedProjections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No players found matching your criteria.
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredAndSortedProjections.length} of {projections.length} players
      </div>
    </div>
  );
};

export default PlayerProjectionsTable; 