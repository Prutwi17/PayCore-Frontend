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
        'bg-white rounded-xl border border-slate-200 shadow-sm p-6',
        onClick && 'cursor-pointer hover:border-slate-300 transition-colors',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
