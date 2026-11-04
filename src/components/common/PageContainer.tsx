import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageContainerProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn('p-6 md:p-8 space-y-6 max-w-7xl mx-auto', className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>}
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
