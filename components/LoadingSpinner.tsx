
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    <p className="text-amber-800 font-medium animate-pulse">Pintando as aquarelas da Bíblia...</p>
  </div>
);
