import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODEL_TYPES, getModelDisplayName } from '../services/nbaDataService';
import { useDarkMode } from '../contexts/DarkModeContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">NBA Fantasy Dashboard</Link>
          <Link to="/" className={`font-medium hover:text-blue-600 dark:hover:text-blue-300 ${location.pathname === '/' ? 'underline' : ''}`}>Home</Link>
          <div className="relative group">
            <button className="font-medium hover:text-blue-600 dark:hover:text-blue-300">Predictions ▾</button>
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-10">
              {MODEL_TYPES.map(model => (
                <Link
                  key={model}
                  to={`/predictions/${model}`}
                  className="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {getModelDisplayName(model)}
                </Link>
              ))}
            </div>
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