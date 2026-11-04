import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
};
