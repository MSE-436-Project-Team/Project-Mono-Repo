import React from 'react';
import type { ModelType } from '../types/nba';
import { getModelDisplayName, getModelDescription } from '../services/nbaDataService';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isLoading = false
}) => {
  const models: ModelType[] = [
    'bayesian',
    'ridge',
    'lightgbm',
    'xgboost',
    'lstm',
    'transformer',
    'ensemble_simple',
    'ensemble_weighted',
    'ensemble_stacking'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select Prediction Model</h2>
      
      <div className="mb-6">
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value as ModelType)}
          disabled={isLoading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {getModelDisplayName(model)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          {getModelDisplayName(selectedModel)}
        </h3>
        <p className="text-sm text-gray-600">
          {getModelDescription(selectedModel)}
        </p>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading predictions...</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 