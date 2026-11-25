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
        'bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 text-slate-900 dark:text-white transition-colors',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
