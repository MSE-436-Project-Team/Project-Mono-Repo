import React, { useState } from 'react';
import type { ScoringWeights } from '../types/nba';
import { DEFAULT_SCORING_WEIGHTS } from '../utils/fantasyScoring';

interface ScoringWeightsFormProps {
  weights: ScoringWeights;
  onWeightsChange: (weights: ScoringWeights) => void;
}

const ScoringWeightsForm: React.FC<ScoringWeightsFormProps> = ({ weights, onWeightsChange }) => {
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
    { 
      key: 'points', 
      label: 'Points', 
      description: 'Total points scored by the player.',
      category: 'basic',
      icon: '🏀'
    },
    { 
      key: 'rebounds', 
      label: 'Rebounds', 
      description: 'Total rebounds (offensive + defensive).',
      category: 'basic',
      icon: '📊'
    },
    { 
      key: 'assists', 
      label: 'Assists', 
      description: 'Total assists.',
      category: 'basic',
      icon: '🤝'
    },
    { 
      key: 'steals', 
      label: 'Steals', 
      description: 'Total steals.',
      category: 'defense',
      icon: '🦹'
    },
    { 
      key: 'blocks', 
      label: 'Blocks', 
      description: 'Total blocks.',
      category: 'defense',
      icon: '🛡️'
    },
    { 
      key: 'turnovers', 
      label: 'Turnovers', 
      description: 'Total turnovers (negative points).',
      category: 'negative',
      icon: '❌'
    },
    { 
      key: 'fieldGoalsMade', 
      label: 'Field Goals Made', 
      description: 'Field goals made.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'fieldGoalsAttempted', 
      label: 'Field Goals Attempted', 
      description: 'Field goals attempted.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'threePointsMade', 
      label: '3-Pointers Made', 
      description: 'Three-pointers made.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'threePointsAttempted', 
      label: '3-Pointers Attempted', 
      description: 'Three-pointers attempted.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'freeThrowsMade', 
      label: 'Free Throws Made', 
      description: 'Free throws made.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'freeThrowsAttempted', 
      label: 'Free Throws Attempted', 
      description: 'Free throws attempted.',
      category: 'shooting',
      icon: '🎯'
    },
    { 
      key: 'offensiveRebounds', 
      label: 'Offensive Rebounds', 
      description: 'Offensive rebounds.',
      category: 'advanced',
      icon: '📊'
    },
    { 
      key: 'defensiveRebounds', 
      label: 'Defensive Rebounds', 
      description: 'Defensive rebounds.',
      category: 'advanced',
      icon: '📊'
    },
    { 
      key: 'personalFouls', 
      label: 'Personal Fouls', 
      description: 'Personal fouls (negative points).',
      category: 'negative',
      icon: '🚫'
    },
  ];

  const categories = {
    basic: { title: 'Basic Stats', color: 'blue' },
    defense: { title: 'Defensive Stats', color: 'green' },
    shooting: { title: 'Shooting Stats', color: 'purple' },
    advanced: { title: 'Advanced Stats', color: 'orange' },
    negative: { title: 'Penalty Stats', color: 'red' }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      orange: 'border-orange-200 bg-orange-50',
      red: 'border-red-200 bg-red-50'
    };
    return colors[category as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Basic Stats */}
      <div className={`border-2 rounded-xl p-6 ${getCategoryColor('blue')}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🏀</span>
          Basic Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoringCategories.filter(cat => cat.category === 'basic').map(({ key, label, description, icon }) => (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </label>
                <div className="relative group">
                  <span className="text-blue-500 text-xs cursor-help">?</span>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                    {description}
                  </div>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                value={weights[key as keyof ScoringWeights]}
                onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Defensive Stats */}
      <div className={`border-2 rounded-xl p-6 ${getCategoryColor('green')}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🛡️</span>
          Defensive Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoringCategories.filter(cat => cat.category === 'defense').map(({ key, label, description, icon }) => (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </label>
                <div className="relative group">
                  <span className="text-blue-500 text-xs cursor-help">?</span>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                    {description}
                  </div>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                value={weights[key as keyof ScoringWeights]}
                onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shooting Stats */}
      <div className={`border-2 rounded-xl p-6 ${getCategoryColor('purple')}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Shooting Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoringCategories.filter(cat => cat.category === 'shooting').map(({ key, label, description, icon }) => (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </label>
                <div className="relative group">
                  <span className="text-blue-500 text-xs cursor-help">?</span>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                    {description}
                  </div>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                value={weights[key as keyof ScoringWeights]}
                onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Stats */}
      <div className={`border-2 rounded-xl p-6 ${getCategoryColor('orange')}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Advanced Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoringCategories.filter(cat => cat.category === 'advanced').map(({ key, label, description, icon }) => (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </label>
                <div className="relative group">
                  <span className="text-blue-500 text-xs cursor-help">?</span>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                    {description}
                  </div>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                value={weights[key as keyof ScoringWeights]}
                onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Penalty Stats */}
      <div className={`border-2 rounded-xl p-6 ${getCategoryColor('red')}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🚫</span>
          Penalty Stats (Negative Points)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoringCategories.filter(cat => cat.category === 'negative').map(({ key, label, description, icon }) => (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-800 flex items-center">
                  <span className="mr-2">{icon}</span>
                  {label}
                </label>
                <div className="relative group">
                  <span className="text-blue-500 text-xs cursor-help">?</span>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-20 shadow-lg">
                    {description}
                  </div>
                </div>
              </div>
              <input
                type="number"
                step="0.1"
                value={weights[key as keyof ScoringWeights]}
                onChange={(e) => handleWeightChange(key as keyof ScoringWeights, parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Example Calculation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-blue-900 mb-3">Example Calculation</h4>
        <p className="text-sm text-blue-800">
          <strong>Sample Player:</strong> 20 points, 10 rebounds (3 offensive, 7 defensive), 5 assists, 2 steals, 1 block, 3 turnovers, 2 personal fouls
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>Fantasy Points:</strong> {20 * weights.points + 10 * weights.rebounds + 5 * weights.assists + 2 * weights.steals + 1 * weights.blocks + 3 * weights.turnovers + 3 * weights.offensiveRebounds + 7 * weights.defensiveRebounds + 2 * weights.personalFouls} points
        </p>
      </div>
    </div>
  );
};

export default ScoringWeightsForm; 