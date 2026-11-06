import React from 'react';

export const BitcoinHeroCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-4 select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-6 -right-6 w-36 h-36 bg-blue-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-6 w-44 h-44 bg-blue-300/30 rounded-full blur-2xl pointer-events-none" />

      {/* Floating 3D glossy spheres matching UI reference */}
      <div className="absolute top-8 left-4 w-7 h-7 rounded-full bg-gradient-to-tr from-blue-300 to-white shadow-md opacity-80 animate-pulse pointer-events-none" />
      <div className="absolute bottom-12 right-2 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-white shadow-lg opacity-75 pointer-events-none" />
      <div className="absolute -top-2 right-16 w-5 h-5 rounded-full bg-gradient-to-tr from-blue-200 to-white shadow-sm opacity-60 pointer-events-none" />

      {/* 3D Stack Container */}
      <div className="relative w-72 h-88 sm:w-80 sm:h-96 flex items-center justify-center">
        {/* Layer 3: Deepest Translucent Card */}
        <div
          className="absolute w-60 h-76 sm:w-68 sm:h-84 rounded-3xl bg-blue-200/40 backdrop-blur-xs border border-white/50 shadow-md"
          style={{
            transform: 'rotate(14deg) translate(36px, 12px) scale(0.92)',
          }}
        />

        {/* Layer 2: Middle Translucent Card */}
        <div
          className="absolute w-64 h-80 sm:w-72 sm:h-88 rounded-3xl bg-blue-100/60 backdrop-blur-xs border border-white/70 shadow-lg"
          style={{
            transform: 'rotate(7deg) translate(20px, 6px) scale(0.96)',
          }}
        />

        {/* Layer 1: Front Primary Bitcoin Card matching UI Reference */}
        <div
          className="relative w-64 h-80 sm:w-72 sm:h-88 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-2xl border border-blue-400/30 flex flex-col items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500 ease-out cursor-pointer group"
          style={{
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
          }}
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none" />

          {/* Prominent White Bitcoin Symbol matching UI Reference */}
          <div className="relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <svg
              className="w-28 h-28 sm:w-32 sm:h-32 text-white filter drop-shadow-md"
              viewBox="0 0 64 64"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bold, authentic Bitcoin symbol */}
              <path d="M33.6 8V13.2H38.4V8H42.4V13.2H45.2V17.8H42.4V25.2H47.6V29.8H42.4V38H47.6V42.6H42.4V50.8H38.4V56H33.6V50.8H28.8V56H24.8V50.8H16V13.2H33.6ZM28.8 25.2V17.8H22.4V25.2H28.8ZM28.8 34.2H22.4V42.6H28.8C33.2 42.6 36.4 40.8 36.4 38.4C36.4 36 33.2 34.2 28.8 34.2ZM28.8 25.2C32.4 25.2 35.2 23.8 35.2 21.5C35.2 19.2 32.4 17.8 28.8 17.8H28.8V25.2ZM42.4 34.2C40.4 32.6 37.6 31.6 34.8 31.2C38 30.2 40.8 28.4 40.8 24.8C40.8 19.6 36 17.8 30.8 17.8V13.2H26.8V17.8H18V46.2H26.8V50.8H30.8V46.2H35.6C41.2 46.2 46.4 43.6 46.4 38.4C46.4 35.6 44.8 34.2 42.4 34.2Z" />
            </svg>
          </div>

          {/* Bottom subtle indicator */}
          <div className="absolute bottom-6 flex items-center space-x-1.5 opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <div className="w-6 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
