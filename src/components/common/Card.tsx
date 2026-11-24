import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-slate-900 dark:text-slate-100 transition-colors',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
