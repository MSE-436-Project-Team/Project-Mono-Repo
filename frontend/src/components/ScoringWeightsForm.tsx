import React, { useState } from 'react';
import type { ScoringWeights } from '../types/nba';
import { DEFAULT_SCORING_WEIGHTS } from '../utils/fantasyScoring';

interface ScoringWeightsFormProps {
  weights: ScoringWeights;
  onWeightsChange: (weights: ScoringWeights) => void;
}

const ScoringWeightsForm: React.FC<ScoringWeightsFormProps> = ({ weights, onWeightsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWeightChange = (key: keyof ScoringWeights, value: number) => {
    onWeightsChange({
      ...weights,
      [key]: value,
    });
  };

  const resetToDefault = () => {
    onWeightsChange(DEFAULT_SCORING_WEIGHTS);
  };

  const scoringCategories = [
    { key: 'points', label: 'Points', description: 'Total points scored by the player.' },
    { key: 'rebounds', label: 'Rebounds', description: 'Total rebounds (offensive + defensive).' },
    { key: 'assists', label: 'Assists', description: 'Total assists.' },
    { key: 'steals', label: 'Steals', description: 'Total steals.' },
    { key: 'blocks', label: 'Blocks', description: 'Total blocks.' },
    { key: 'turnovers', label: 'Turnovers', description: 'Total turnovers (negative points).' },
    { key: 'fieldGoalsMade', label: 'FGM', description: 'Field goals made.' },
    { key: 'fieldGoalsAttempted', label: 'FGA', description: 'Field goals attempted.' },
    { key: 'threePointsMade', label: '3PM', description: 'Three-pointers made.' },
    { key: 'threePointsAttempted', label: '3PA', description: 'Three-pointers attempted.' },
    { key: 'freeThrowsMade', label: 'FTM', description: 'Free throws made.' },
    { key: 'freeThrowsAttempted', label: 'FTA', description: 'Free throws attempted.' },
    { key: 'offensiveRebounds', label: 'OREB', description: 'Offensive rebounds.' },
    { key: 'defensiveRebounds', label: 'DREB', description: 'Defensive rebounds.' },
    { key: 'personalFouls', label: 'PF', description: 'Personal fouls (negative points).' },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fantasy Scoring Weights</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-secondary text-sm"
          >
            {isExpanded ? 'Collapse' : 'Customize'}
          </button>
          <button
            onClick={resetToDefault}
            className="btn-secondary text-sm"
          >
            Reset to Default
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {scoringCategories.slice(0, 6).map(({ key, label, description }) => (
          <div key={key} className="flex items-center gap-2 mb-2">
            <label className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
              {label}
              <span className="relative group cursor-pointer">
                <span className="text-blue-500 text-xs ml-1">?</span>
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                  {description}
                </span>
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              value={weights[key as keyof ScoringWeights]}
              onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
              className="input-field text-sm"
              placeholder="0.0"
            />
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-800 mb-3">Advanced Scoring Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scoringCategories.slice(6).map(({ key, label, description }) => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <label className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  {label}
                  <span className="relative group cursor-pointer">
                    <span className="text-blue-500 text-xs ml-1">?</span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                      {description}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weights[key as keyof ScoringWeights]}
                  onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                  className="input-field text-sm"
                  placeholder="0.0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Example:</strong> A player with 20 points, 10 rebounds (3 offensive, 7 defensive), 5 assists, 2 steals, 1 block, 3 turnovers, and 2 personal fouls 
          would score: {20 * weights.points + 10 * weights.rebounds + 5 * weights.assists + 2 * weights.steals + 1 * weights.blocks + 3 * weights.turnovers + 3 * weights.offensiveRebounds + 7 * weights.defensiveRebounds + 2 * weights.personalFouls} fantasy points
        </p>
      </div>
    </div>
  );
};

export default ScoringWeightsForm; 