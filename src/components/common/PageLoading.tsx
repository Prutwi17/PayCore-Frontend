import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message = 'Loading PayCore...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};
