import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const GoldenCoin3D: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-md mx-auto flex items-center justify-center p-6 sm:p-10 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-blue-600/20 via-amber-500/20 to-yellow-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Outer Tilted Blue Orbital Ring + 2 Orbiting Design Spheres */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { rotateZ: 0 }
            : { rotateZ: [0, 360] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 16, repeat: Infinity, ease: 'linear' }
        }
        className="absolute w-76 h-76 sm:w-[360px] sm:h-[360px] rounded-full border-2 border-dashed border-blue-400/45 dark:border-blue-400/35 pointer-events-none z-10"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 0 24px rgba(59, 130, 246, 0.15)',
        }}
      >
        {/* Top Orbiting Blue Metallic Ball */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-lg"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #EFF6FF 0%, #60A5FA 45%, #1D4ED8 100%)',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
          }}
        />
        {/* Bottom Orbiting Blue Metallic Ball */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #DBEAFE 0%, #3B82F6 55%, #1E40AF 100%)',
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)',
          }}
        />
      </motion.div>

      {/* Inner Counter-Rotating Golden Orbital Ring + 2 Orbiting Gold Spheres */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { rotateZ: 0 }
            : { rotateZ: [360, 0] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 12, repeat: Infinity, ease: 'linear' }
        }
        className="absolute w-68 h-68 sm:w-[308px] sm:h-[308px] rounded-full border border-amber-400/60 dark:border-amber-400/45 pointer-events-none z-20"
        style={{
          boxShadow: 'inset 0 0 16px rgba(245, 158, 11, 0.15), 0 0 20px rgba(245, 158, 11, 0.18)',
        }}
      >
        {/* Left Orbiting Golden Ball */}
        <div
          className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #FEF9C3 0%, #FBBF24 45%, #B45309 100%)',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.7)',
          }}
        />
        {/* Right Orbiting Golden Ball */}
        <div
          className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #FEF08A 0%, #F59E0B 55%, #92400E 100%)',
            boxShadow: '0 0 12px rgba(217, 119, 6, 0.6)',
          }}
        />
      </motion.div>

      {/* Static Subtle Accent Ring */}
      <div className="absolute w-80 h-80 sm:w-[392px] sm:h-[392px] rounded-full border border-slate-200/70 dark:border-slate-700/50 pointer-events-none" />

      {/* 3D Stage with Mouse Parallax Tilting */}
      <motion.div
        animate={{
          rotateX: shouldReduceMotion ? 0 : mousePos.y * -14,
          rotateZ: shouldReduceMotion ? 0 : mousePos.x * 8,
          y: shouldReduceMotion ? 0 : [-6, 6, -6],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 200, damping: 25 },
          rotateZ: { type: 'spring', stiffness: 200, damping: 25 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center z-30"
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
          className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 3D Cylindrical Edge Layers */}
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

          {/* FRONT FACE */}
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

            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
              }}
            />

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

            <div className="absolute bottom-6 flex items-center space-x-1.5 opacity-80">
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-950">
                PAYCORE
              </span>
            </div>
          </div>

          {/* BACK FACE */}
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

            <div
              className="absolute inset-4 rounded-full border border-amber-300/80 pointer-events-none"
              style={{
                boxShadow:
                  'inset 0 2px 4px rgba(120, 53, 15, 0.6), 0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            />

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
                PAYCORE
              </span>
            </div>

            <div className="absolute bottom-6 text-[8px] font-black uppercase tracking-widest text-amber-950 opacity-80">
              PAYMENTS
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
