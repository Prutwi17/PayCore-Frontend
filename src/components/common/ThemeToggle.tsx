import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        isDark
          ? 'bg-black text-white border-zinc-700 hover:bg-zinc-900'
          : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50',
        className
      )}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slate-700" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};
