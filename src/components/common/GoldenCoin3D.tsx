import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export const GoldenCoin3D: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle gentle mouse parallax tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // 16 floating micro particles
  const particles = [
    { top: '10%', left: '15%', size: 'w-2 h-2', delay: 0, dur: 4.2 },
    { top: '22%', left: '85%', size: 'w-2.5 h-2.5', delay: 0.8, dur: 5.1 },
    { top: '75%', left: '12%', size: 'w-1.5 h-1.5', delay: 1.5, dur: 3.8 },
    { top: '82%', left: '80%', size: 'w-2 h-2', delay: 0.4, dur: 4.6 },
    { top: '15%', left: '70%', size: 'w-1.5 h-1.5', delay: 1.2, dur: 4.0 },
    { top: '65%', left: '90%', size: 'w-2 h-2', delay: 2.1, dur: 4.8 },
    { top: '40%', left: '8%', size: 'w-2.5 h-2.5', delay: 0.6, dur: 5.4 },
    { top: '55%', left: '88%', size: 'w-1.5 h-1.5', delay: 1.8, dur: 3.5 },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto flex items-center justify-center p-4 sm:p-8 select-none"
      style={{ perspective: '1100px' }}
    >
      {/* 1. Ambient Background Glow (Soft Blue + Warm Golden Radiance) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-blue-600/20 via-amber-500/25 to-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* 2. Floating Golden Sparks & Particles */}
      {!shouldReduceMotion &&
        particles.map((p, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            style={{ top: p.top, left: p.left }}
            className={`absolute ${p.size} rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-white shadow-sm pointer-events-none z-10`}
          />
        ))}

      {/* 3. Floating Payment Status Pill (Top Left) */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: shouldReduceMotion ? 0 : [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
        }}
        className="absolute -top-3 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-amber-100/80 z-30 flex items-center space-x-3"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Payment Verified</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            $2,450.00 <span className="text-xs font-normal text-slate-500">USD</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Floating Settlement Badge (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: shouldReduceMotion ? 0 : [0, 8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          x: { duration: 0.6, delay: 0.5 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.0 },
        }}
        className="absolute -bottom-5 -right-2 sm:-right-4 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-800 z-30 flex items-center space-x-3"
      >
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Settlement Engine</div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>Instant & Multi-Currency</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </motion.div>

      {/* 5. 3D Stage with Mouse Parallax Tilting */}
      <motion.div
        animate={{
          rotateX: shouldReduceMotion ? 0 : mousePos.y * -14,
          rotateZ: shouldReduceMotion ? 0 : mousePos.x * 8,
          y: shouldReduceMotion ? 0 : [-8, 8, -8],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 200, damping: 25 },
          rotateZ: { type: 'spring', stiffness: 200, damping: 25 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Continuous 3D Vertical Axis Rotating Coin Container */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { rotateY: 25 }
              : { rotateY: [0, 360] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 11, repeat: Infinity, ease: 'linear' }
          }
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* =========================================================
              3D CYLINDRICAL EDGE / FLUTED THICKNESS LAYERS
              Extrudes the coin in 3D space with gold fluting
              ========================================================= */}
          {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((offsetZ, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                transform: `translateZ(${offsetZ}px)`,
                background:
                  'radial-gradient(circle, #D97706 0%, #92400E 70%, #78350F 100%)',
                boxShadow: '0 0 1px 1px rgba(180, 83, 9, 0.4)',
              }}
            />
          ))}

          {/* =========================================================
              FRONT FACE (Golden Metallic Coin with Embossed ₿)
              Positioned at translateZ(10px)
              ========================================================= */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden flex flex-col items-center justify-center shadow-2xl"
            style={{
              transform: 'translateZ(10px)',
              backfaceVisibility: 'hidden',
              background:
                'radial-gradient(circle at 35% 30%, #FFF8D6 0%, #FBBF24 25%, #F59E0B 55%, #D97706 80%, #78350F 100%)',
              boxShadow:
                'inset 0 0 0 5px #FDE68A, inset 0 0 0 8px #92400E, inset 0 0 0 12px #FBBF24, 0 20px 45px -10px rgba(180, 83, 9, 0.65)',
            }}
          >
            {/* Outer Serrated / Reeded Rim Notches */}
            <div
              className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
              style={{
                background:
                  'repeating-conic-gradient(#FDE68A 0deg 2deg, #92400E 2deg 4deg)',
                maskImage:
                  'radial-gradient(circle, transparent 92%, black 93%)',
                WebkitMaskImage:
                  'radial-gradient(circle, transparent 92%, black 93%)',
              }}
            />

            {/* Concentric Inner Golden Beaded Ring */}
            <div
              className="absolute inset-4 rounded-full border border-amber-300/80 pointer-events-none"
              style={{
                boxShadow:
                  'inset 0 2px 4px rgba(120, 53, 15, 0.6), 0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            />
            <div
              className="absolute inset-7 rounded-full border border-dashed border-amber-700/50 pointer-events-none"
            />

            {/* Metallic Specular Sweep Highlight */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
              }}
            />

            {/* Embossed Bitcoin-Inspired Symbol (₿) */}
            <div className="relative flex items-center justify-center select-none">
              <span
                className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text leading-none"
                style={{
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  backgroundImage:
                    'linear-gradient(180deg, #FFFFFF 0%, #FEF08A 20%, #F59E0B 60%, #92400E 100%)',
                  filter:
                    'drop-shadow(2px 3px 2px rgba(120, 53, 15, 0.9)) drop-shadow(-1px -1px 1px rgba(255, 255, 240, 0.9))',
                }}
              >
                ₿
              </span>
            </div>

            {/* Micro Inscriptions on Coin Face */}
            <div className="absolute bottom-6 flex items-center space-x-1.5 opacity-80">
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-950">
                PAYCORE • DIGITAL
              </span>
            </div>
          </div>

          {/* =========================================================
              BACK FACE (Golden Reverse with Digital Currency Emblem)
              Positioned at translateZ(-10px) rotateY(180deg)
              ========================================================= */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden flex flex-col items-center justify-center shadow-2xl"
            style={{
              transform: 'translateZ(-10px) rotateY(180deg)',
              backfaceVisibility: 'hidden',
              background:
                'radial-gradient(circle at 65% 70%, #FFF8D6 0%, #FBBF24 25%, #F59E0B 55%, #D97706 80%, #78350F 100%)',
              boxShadow:
                'inset 0 0 0 5px #FDE68A, inset 0 0 0 8px #92400E, inset 0 0 0 12px #FBBF24, 0 20px 45px -10px rgba(180, 83, 9, 0.65)',
            }}
          >
            {/* Outer Reeded Ring */}
            <div
              className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
              style={{
                background:
                  'repeating-conic-gradient(#FDE68A 0deg 2deg, #92400E 2deg 4deg)',
                maskImage:
                  'radial-gradient(circle, transparent 92%, black 93%)',
                WebkitMaskImage:
                  'radial-gradient(circle, transparent 92%, black 93%)',
              }}
            />

            {/* Inner Concentric Ring */}
            <div
              className="absolute inset-4 rounded-full border border-amber-300/80 pointer-events-none"
              style={{
                boxShadow:
                  'inset 0 2px 4px rgba(120, 53, 15, 0.6), 0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            />

            {/* Center Emblem: PayCore Shield & Lightning */}
            <div className="relative flex flex-col items-center justify-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-amber-950"
                style={{
                  filter:
                    'drop-shadow(2px 3px 2px rgba(120, 53, 15, 0.85)) drop-shadow(-1px -1px 1px rgba(255, 255, 240, 0.9))',
                }}
              >
                <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-amber-950" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-950 mt-1">
                INFRASTRUCTURE
              </span>
            </div>

            <div className="absolute bottom-6 text-[8px] font-black uppercase tracking-widest text-amber-950 opacity-80">
              GLOBAL SETTLEMENT
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
