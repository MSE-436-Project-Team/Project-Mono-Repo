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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2 text-blue-900">Custom Fantasy Scoring</h2>
        <p className="text-gray-700 mb-6">Set your league's custom point weights for each stat category. Save or reset to defaults at any time.</p>
        <ScoringWeightsForm weights={weights} onWeightsChange={setWeights} />
        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        {saved && <div className="mt-4 text-green-600 font-semibold">Saved!</div>}
      </div>
    </div>
  );
};

export default CustomScoringPage; 