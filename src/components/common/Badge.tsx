import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  variant?: 'success' | 'processing' | 'failed' | 'warning' | 'neutral';
  children: ReactNode;
  className?: string;
}

import { ReactNode } from 'react';

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
