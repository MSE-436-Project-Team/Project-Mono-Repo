import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const models: ModelType[] = [
    // 'bayesian',
    'ridge',
    'lightgbm',
    'xgboost',
    // 'lstm',
    // 'transformer',
    // 'ensemble_simple',
    'ensemble_weighted',
    // 'ensemble_stacking'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModelSelect = (model: ModelType) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select Prediction Model</h2>
      
      <div className="mb-6 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between"
        >
          <span>{getModelDisplayName(selectedModel)}</span>
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => handleModelSelect(model)}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors ${
                  selectedModel === model 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {getModelDisplayName(model)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {getModelDisplayName(selectedModel)}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {getModelDescription(selectedModel)}
        </p>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Loading predictions...</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 