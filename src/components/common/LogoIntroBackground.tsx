import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, FastForward, RotateCcw } from 'lucide-react';

interface LogoIntroBackgroundProps {
  onIntroComplete?: () => void;
  logoSrc?: string;
}

export const LogoIntroBackground: React.FC<LogoIntroBackgroundProps> = ({
  onIntroComplete,
  logoSrc = '/assets/logo-little-star.png'
}) => {
  // Intro animation states: 'playing' | 'zooming_out' | 'docked'
  // Otomatis muncul lagi setiap kali website dibuka atau direfresh
  const [introPhase, setIntroPhase] = useState<'playing' | 'zooming_out' | 'docked'>('playing');

  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.042); // Delicately calibrated opacity

  useEffect(() => {
    if (introPhase === 'playing') {
      // Phase 1: Logo enters and expands (fills screen with golden rays)
      const zoomOutTimer = setTimeout(() => {
        setIntroPhase('zooming_out');
      }, 2600);

      return () => clearTimeout(zoomOutTimer);
    } else if (introPhase === 'zooming_out') {
      // Phase 2: Logo smoothly zooms out into background watermark position
      const dockTimer = setTimeout(() => {
        setIntroPhase('docked');
        if (onIntroComplete) onIntroComplete();
      }, 900);

      return () => clearTimeout(dockTimer);
    }
  }, [introPhase, onIntroComplete]);

  const handleSkip = () => {
    setIntroPhase('docked');
    if (onIntroComplete) onIntroComplete();
  };

  const handleReplay = () => {
    setIntroPhase('playing');
  };

  return (
    <>
      {/* 1. Cinematic Fullscreen Intro Video Experience */}
      <AnimatePresence>
        {introPhase !== 'docked' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: introPhase === 'zooming_out' ? 0 : 1,
              transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
            }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden select-none"
          >
            {/* Cinematic Ambient Radial Glow & Rotating Rainbow Star Rays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Rotating rainbow rays aura matching the Little Star logo petals */}
              <div className="w-[800px] h-[800px] rounded-full bg-[conic-gradient(from_0deg,#e11d48,#f59e0b,#eab308,#10b981,#06b6d4,#3b82f6,#8b5cf6,#e11d48)] opacity-20 blur-3xl animate-[spin_20s_linear_infinite]" />
              
              {/* Golden Core Spotlight */}
              <div className="absolute w-[450px] h-[450px] rounded-full bg-radial from-amber-300/35 via-yellow-400/20 to-transparent blur-2xl animate-pulse" />
            </div>

            {/* Floating Twinkle Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-[18%] left-[22%] text-2xl text-amber-300 animate-pulse">✨</span>
              <span className="absolute top-[28%] right-[24%] text-3xl text-yellow-300 animate-bounce">⭐</span>
              <span className="absolute bottom-[24%] left-[28%] text-xl text-sky-300 animate-pulse">✨</span>
              <span className="absolute bottom-[20%] right-[22%] text-2xl text-amber-400 animate-bounce">🌟</span>
            </div>

            {/* Skip Intro Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 text-[11px] sm:text-xs font-bold tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer uppercase shadow-lg active:scale-95"
            >
              <span>Lewati Intro</span>
              <FastForward className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </button>

            {/* Center Cinematic Logo Container */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
              <motion.div
                initial={{ scale: 0.35, opacity: 0, y: 30 }}
                animate={{
                  scale: introPhase === 'zooming_out' ? [1.05, 0.45] : [0.35, 1.15, 1.05],
                  opacity: introPhase === 'zooming_out' ? [1, 0.2] : [0, 1, 1],
                  y: introPhase === 'zooming_out' ? [0, -10] : [30, -5, 0]
                }}
                transition={{
                  duration: introPhase === 'zooming_out' ? 0.85 : 2.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative flex items-center justify-center"
              >
                {/* Luminous Logo Glow Behind Image */}
                <div className="absolute -inset-8 bg-gradient-to-tr from-amber-400/30 via-yellow-300/40 to-blue-400/25 rounded-full blur-2xl" />

                {/* The Little Star Logo Image */}
                <img
                  src={logoSrc}
                  alt="Little Star Learning Center"
                  className="relative w-44 sm:w-64 md:w-80 max-h-[45vh] sm:max-h-[58vh] object-contain drop-shadow-[0_15px_35px_rgba(251,191,36,0.55)] transition-all"
                />
              </motion.div>

              {/* Title & Tagline with Motion Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: introPhase === 'zooming_out' ? 0 : 1,
                  y: introPhase === 'zooming_out' ? -15 : 0
                }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 sm:mt-6 space-y-1.5 px-2"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>Selamat Datang di</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-md">
                  Little Star Learning Center
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-medium leading-relaxed">
                  Pusat Pembelajaran Inklusif & Layanan Terapi Terpadu Anak Berkebutuhan Khusus dan Reguler
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Persistent Ambient Background Watermark (Latar Belakang)
          "lalu logo akan menjadi latar belakang tapi sesuaikan itensitasnya jangan sampai mengganggu konten yang sudah ada"
          - Pointer-events-none
          - Fixed -z-10
          - Calibrated subtle opacity (watermarkOpacity ~ 0.042)
      */}
      <div 
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none transition-opacity duration-1000"
      >
        {/* Subtle Watermark Glow */}
        <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-amber-300/5 blur-3xl pointer-events-none" />

        <img
          src={logoSrc}
          alt=""
          style={{ opacity: watermarkOpacity }}
          className="w-[260px] sm:w-[440px] lg:w-[620px] max-w-[88vw] max-h-[85vh] object-contain transition-all duration-700 contrast-125"
        />
      </div>

      {/* 3. Sleek Floating "Putar Ulang Video Intro Logo" Button (at bottom-left, clears mobile bottom nav) */}
      <div className="fixed bottom-20 lg:bottom-4 left-3 sm:left-4 z-30">
        <button
          onClick={handleReplay}
          title="Putar Ulang Video Intro Logo Little Star"
          className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 border border-amber-200/90 shadow-md hover:shadow-lg transition-all backdrop-blur-md text-[10px] sm:text-[11px] font-bold cursor-pointer hover:scale-105 active:scale-95"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xs group-hover:rotate-180 transition-transform duration-500">
            <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
          <span className="font-display text-[10px] sm:text-[11px]">Intro Logo</span>
        </button>
      </div>
    </>
  );
};
