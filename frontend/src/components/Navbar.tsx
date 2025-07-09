import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODEL_TYPES, getModelDisplayName } from '../services/nbaDataService';
import { useDarkMode } from '../contexts/DarkModeContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //Filtered models nav bar
  const filteredModels = MODEL_TYPES.filter(model => !['bayesian', 'lstm', 'transformer', 'ensemble_simple', 'ensemble_stacking'].includes(model));

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">NBA Fantasy Dashboard</Link>
          <Link to="/" className={`font-medium hover:text-blue-600 dark:hover:text-blue-300 ${location.pathname === '/' ? 'underline' : ''}`}>Home</Link>
          <div className="relative" ref={dropdownRef}>
            <button 
              className="font-medium hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Predictions 
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {filteredModels.map(model => (
                  <Link
                    key={model}
                    to={`/predictions/${model}`}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {getModelDisplayName(model)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/scoring" className={`font-medium hover:text-blue-600 dark:hover:text-blue-300 ${location.pathname === '/scoring' ? 'underline' : ''}`}>Custom Scoring</Link>
        </div>
        <button
          className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 