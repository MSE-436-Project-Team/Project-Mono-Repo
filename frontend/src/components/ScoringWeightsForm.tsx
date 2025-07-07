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
    { key: 'points', label: 'Points', description: 'Points scored' },
    { key: 'rebounds', label: 'Rebounds', description: 'Total rebounds' },
    { key: 'assists', label: 'Assists', description: 'Assists' },
    { key: 'steals', label: 'Steals', description: 'Steals' },
    { key: 'blocks', label: 'Blocks', description: 'Blocks' },
    { key: 'turnovers', label: 'Turnovers', description: 'Turnovers (negative)' },
    { key: 'fieldGoalsMade', label: 'Field Goals Made', description: 'Field goals made' },
    { key: 'fieldGoalsAttempted', label: 'Field Goals Attempted', description: 'Field goals attempted' },
    { key: 'threePointsMade', label: '3-Pointers Made', description: 'Three-pointers made' },
    { key: 'threePointsAttempted', label: '3-Pointers Attempted', description: 'Three-pointers attempted' },
    { key: 'freeThrowsMade', label: 'Free Throws Made', description: 'Free throws made' },
    { key: 'freeThrowsAttempted', label: 'Free Throws Attempted', description: 'Free throws attempted' },
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
        {scoringCategories.slice(0, 6).map((category) => (
          <div key={category.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {category.label}
            </label>
            <input
              type="number"
              step="0.1"
              value={weights[category.key as keyof ScoringWeights]}
              onChange={(e) => handleWeightChange(category.key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
              className="input-field text-sm"
              placeholder="0.0"
            />
            <p className="text-xs text-gray-500">{category.description}</p>
          </div>
        ))}
      </div>

      {isExpanded && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-800 mb-3">Advanced Scoring Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scoringCategories.slice(6).map((category) => (
              <div key={category.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {category.label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weights[category.key as keyof ScoringWeights]}
                  onChange={(e) => handleWeightChange(category.key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                  className="input-field text-sm"
                  placeholder="0.0"
                />
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Example:</strong> A player with 20 points, 10 rebounds, 5 assists, 2 steals, 1 block, and 3 turnovers 
          would score: {20 * weights.points + 10 * weights.rebounds + 5 * weights.assists + 2 * weights.steals + 1 * weights.blocks + 3 * weights.turnovers} fantasy points
        </p>
      </div>
    </div>
  );
};

export default ScoringWeightsForm; 