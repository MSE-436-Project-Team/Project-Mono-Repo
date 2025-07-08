import React, { useState, useEffect } from 'react';
import ScoringWeightsForm from '../components/ScoringWeightsForm';
import { DEFAULT_SCORING_WEIGHTS } from '../utils/fantasyScoring';
import type { ScoringWeights } from '../types/nba';

const LOCAL_STORAGE_KEY = 'customScoringWeights';

const CustomScoringPage: React.FC = () => {
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_SCORING_WEIGHTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedWeights = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedWeights) {
      setWeights(JSON.parse(savedWeights));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(weights));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setWeights(DEFAULT_SCORING_WEIGHTS);
    setSaved(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Custom Fantasy Scoring</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Customize your league's scoring system to match your preferences. 
            Set point values for each statistical category to create your perfect fantasy experience.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scoring Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scoring Weights</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              
              {saved && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 dark:text-green-200 font-medium">Settings saved successfully!</span>
                  </div>
                </div>
              )}

              <ScoringWeightsForm weights={weights} onWeightsChange={setWeights} />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Positive values award points, negative values deduct points</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Common settings: Points (1), Rebounds (1.2), Assists (1.5)</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Turnovers and fouls typically have negative values</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Settings are automatically saved to your browser</p>
                </div>
              </div>
            </div>

            {/* Popular Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Presets</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setWeights({
                    points: 1, rebounds: 1.2, assists: 1.5, steals: 2, blocks: 2,
                    turnovers: -1, fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    threePointsMade: 0, threePointsAttempted: 0, freeThrowsMade: 0,
                    freeThrowsAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                    personalFouls: -0.5
                  })}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Standard Fantasy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Points (1), Rebounds (1.2), Assists (1.5)</div>
                </button>
                <button
                  onClick={() => setWeights({
                    points: 1, rebounds: 1, assists: 1, steals: 1, blocks: 1,
                    turnovers: -1, fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    threePointsMade: 0, threePointsAttempted: 0, freeThrowsMade: 0,
                    freeThrowsAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                    personalFouls: -1
                  })}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Equal Weight</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">All positive stats (1), negative stats (-1)</div>
                </button>
                <button
                  onClick={() => setWeights({
                    points: 1, rebounds: 1.2, assists: 1.5, steals: 2, blocks: 2,
                    turnovers: -1, fieldGoalsMade: 0, fieldGoalsAttempted: 0,
                    threePointsMade: 0, threePointsAttempted: 0, freeThrowsMade: 0,
                    freeThrowsAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                    personalFouls: -0.5
                  })}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Defense Heavy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Emphasizes steals and blocks</div>
                </button>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Points:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{weights.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Rebounds:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{weights.rebounds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Assists:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{weights.assists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Steals:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{weights.steals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Blocks:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{weights.blocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Turnovers:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{weights.turnovers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomScoringPage; 