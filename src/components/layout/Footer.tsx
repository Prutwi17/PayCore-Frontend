import React from 'react';
import logoSvg from '@/assets/logo.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <img src={logoSvg} alt="PayCore" className="h-7 w-7" />
          <span className="text-base font-bold text-slate-900">
            Pay<span className="text-blue-600">Core</span>
          </span>
          <span className="text-xs text-slate-500">| Payment Processing Engine</span>
        </div>

        <p className="text-xs text-slate-500">
          Independent Payment Gateway & Processing Infrastructure.
        </p>

        <div className="flex items-center space-x-6 text-xs text-slate-500">
          <span>Documentation</span>
          <span>API Reference</span>
          <span>Status</span>
        </div>
      </div>
    </footer>
  );
};
