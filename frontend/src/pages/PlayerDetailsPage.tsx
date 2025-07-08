import React from 'react';

const PlayerDetailsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-900">Player Details</h2>
        <p className="text-gray-700">Player details and history will be shown here.</p>
      </div>
    </div>
  );
};

export default PlayerDetailsPage; 