import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logoSvg} alt="PayCore Logo" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Pay<span className="text-blue-600">Core</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#modules" className="hover:text-blue-600 transition-colors">Modules</a>
          <a href="#docs" className="hover:text-blue-600 transition-colors">Docs</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};
