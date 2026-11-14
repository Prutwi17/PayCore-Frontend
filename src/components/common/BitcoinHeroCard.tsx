import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';

export const BitcoinHeroCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-4 sm:p-8 select-none">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D glossy spheres matching UI reference */}
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-6 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-300 via-white/80 to-blue-100 shadow-md opacity-85 pointer-events-none z-20 border border-white/60"
      />
      <motion.div
        animate={{ y: [0, 14, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 via-blue-200 to-white shadow-xl opacity-80 pointer-events-none z-20 border border-white/50"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-2 right-20 w-6 h-6 rounded-full bg-gradient-to-tr from-blue-200 to-white shadow-sm opacity-70 pointer-events-none z-20"
      />

      {/* Floating Transaction Pill: "Payment Approved $1,990.00" */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
        }}
        className="absolute -top-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-blue-100 z-30 flex items-center space-x-3"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Payment Approved</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-sm font-extrabold text-slate-900">$1,990.00 <span className="text-xs font-normal text-slate-500">USD</span></div>
        </div>
      </motion.div>

      {/* Floating Settlement Badge: "Instant Settlement Active" */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          x: { duration: 0.6, delay: 0.5 },
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
        }}
        className="absolute -bottom-6 -right-2 sm:-right-6 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-800 z-30 flex items-center space-x-2.5"
      >
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Zap className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Settlement Engine</div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>Instant & Multi-Currency</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </motion.div>

      {/* 3D Stack Container matching UI Reference */}
      <div className="relative w-72 h-88 sm:w-80 sm:h-96 flex items-center justify-center">
        {/* Layer 3: Deepest Translucent Tilted Card */}
        <div
          className="absolute w-60 h-76 sm:w-68 sm:h-84 rounded-3xl bg-blue-200/50 backdrop-blur-sm border border-white/60 shadow-lg"
          style={{
            transform: 'rotate(14deg) translate(38px, 16px) scale(0.92)',
          }}
        />

        {/* Layer 2: Middle Translucent Tilted Card */}
        <div
          className="absolute w-64 h-80 sm:w-72 sm:h-88 rounded-3xl bg-blue-100/70 backdrop-blur-sm border border-white/80 shadow-xl"
          style={{
            transform: 'rotate(7deg) translate(20px, 8px) scale(0.96)',
          }}
        />

        {/* Layer 1: Front Primary Bitcoin Card matching UI Reference */}
        <motion.div
          whileHover={{ rotate: 0, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-64 h-80 sm:w-72 sm:h-88 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-2xl border border-blue-400/40 flex flex-col items-center justify-center cursor-pointer group z-10"
          style={{
            transform: 'rotate(-6deg)',
            boxShadow: '0 25px 60px -15px rgba(29, 78, 216, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
          }}
        >
          {/* Subtle glossy card highlight */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/5 to-white/25 pointer-events-none" />

          {/* Top Card Header */}
          <div className="absolute top-5 left-6 right-6 flex items-center justify-between opacity-80">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">PayCore Digital</span>
            <ShieldCheck className="w-4 h-4 text-white/80" />
          </div>

          {/* Prominent White Bitcoin Symbol matching UI Reference */}
          <div className="relative flex items-center justify-center my-auto transform group-hover:scale-108 transition-transform duration-300">
            <div className="text-white font-extrabold text-7xl sm:text-8xl select-none filter drop-shadow-lg leading-none">
              ₿
            </div>
          </div>

          {/* Bottom Card Footer with Currency Chips */}
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 opacity-75">
              <span className="text-[10px] font-semibold text-white/90 uppercase tracking-widest">GLOBAL SETTLEMENT</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold text-white">USD</span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold text-white">EUR</span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold text-white">INR</span>
              <span className="px-1.5 py-0.5 rounded bg-white/30 text-[9px] font-bold text-white">BTC</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
