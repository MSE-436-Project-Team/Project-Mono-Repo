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
    'ensemble_weighted'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select Prediction Model</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {models.map((model) => (
          <button
            key={model}
            onClick={() => onModelChange(model)}
            disabled={isLoading}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 min-w-0 text-xs whitespace-normal break-words
              ${selectedModel === model
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="font-medium text-xs break-words whitespace-normal">{getModelDisplayName(model)}</div>
          </button>
        ))}
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