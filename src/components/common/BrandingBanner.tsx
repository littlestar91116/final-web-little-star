import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Award, ShieldCheck, Sun, Star, Crown, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import GlowCursor from './GlowCursor';

export const BrandingBanner: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings } = useSiteSettings();
  const defaultLogoPath = '/assets/aistudio/Desain_tanpa_judul_20250712_130635_0000__1__c8a27306.png';
  const logoPath = settings.logoUrl || defaultLogoPath;

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(new Date());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white shadow-2xl shadow-indigo-950/25 mb-8 border border-amber-400/35 light-sweep-effect"
    >
      <GlowCursor
        color="#f97316"
        secondaryColor="#3b82f6"
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        clickBurst
        theme="dark"
      >
      {/* Animated Floating Luminous Background Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/25 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -25, 0],
          y: [0, 15, 0],
          scale: [1, 1.12, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-600/20 to-blue-500/15 rounded-full blur-3xl pointer-events-none" 
      />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Rotating Sun Emblem & Floating Sparkle Stars */}
      <div className="absolute top-2 right-8 opacity-15 pointer-events-none hidden md:block">
        <Sun className="w-40 h-40 text-amber-300 animate-spin" style={{ animationDuration: '60s' }} />
      </div>

      <div className="absolute top-6 left-1/3 pointer-events-none text-amber-400/40 animate-star-twinkle">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-6 right-1/4 pointer-events-none text-cyan-300/40 animate-star-twinkle" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        {/* Left: Royal Brand Presentation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative shrink-0"
          >
            {/* Pulsing golden halo ring */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 rounded-3xl blur-xs opacity-75 animate-pulse" />
            
            <div className="relative bg-white/95 backdrop-blur-md p-3.5 rounded-3xl shadow-xl shadow-amber-900/30 border border-amber-200">
              <img
                src={logoPath}
                alt={`${settings.schoolName} ${settings.schoolUnit}`}
                className="h-16 w-auto md:h-20 lg:h-22 object-contain drop-shadow-sm"
              />
            </div>
            
            {/* Crown luxury badge with gentle bounce */}
            <motion.div 
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-md cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
            </motion.div>
          </motion.div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-sm uppercase tracking-wider shimmer-badge">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                Tahun Ajaran 2026/2027
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                Sistem Terpadu Inklusif Premium
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight font-display bg-gradient-to-r from-white via-amber-100 to-yellow-200 bg-clip-text text-transparent uppercase">
              {settings.schoolName} {settings.schoolUnit}
            </h1>

            <p className="text-indigo-200/90 text-sm md:text-base font-medium flex items-center gap-2">
              <span className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }}>✦</span>
              <span>{settings.tagline}</span>
              <span className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }}>✦</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-indigo-200/80">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-slate-200">{todayFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Masuk sebagai: <strong className="text-white capitalize">{currentUser?.name || 'Pengguna'}</strong>{' '}
                  <span className="text-amber-300 font-mono text-[11px]">({currentUser?.role ? currentUser.role.replace(/_/g, ' ') : '-'})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 4 Animated Jewel Program Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 shrink-0">
          {/* Program 1: Sekolah Pagi (Sun Amber) */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="relative group overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-600/10 backdrop-blur-md rounded-2xl p-3.5 border border-amber-400/40 hover:border-amber-300 transition-all shadow-md shadow-amber-950/20 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">Program 1</span>
              <motion.span 
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-amber-400 text-xs inline-block"
              >
                ☀️
              </motion.span>
            </div>
            <div className="text-sm font-extrabold text-white font-display">Sekolah Pagi</div>
            <span className="text-[10px] text-amber-200/70 block mt-0.5">Kurikulum Inklusif</span>
          </motion.div>

          {/* Program 2: Layanan Terapi (Emerald) */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="relative group overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-600/10 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-400/40 hover:border-emerald-300 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">Program 2</span>
              <motion.span 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-emerald-400 text-xs inline-block"
              >
                🌿
              </motion.span>
            </div>
            <div className="text-sm font-extrabold text-white font-display">Layanan Terapi</div>
            <span className="text-[10px] text-emerald-200/70 block mt-0.5">Wicara, Okupasi, SI</span>
          </motion.div>

          {/* Program 3: DayCare Edukatif (Rose Coral) */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="relative group overflow-hidden bg-gradient-to-br from-rose-500/20 to-pink-600/10 backdrop-blur-md rounded-2xl p-3.5 border border-rose-400/40 hover:border-rose-300 transition-all shadow-md shadow-rose-950/20 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-rose-300">Program 3</span>
              <motion.span 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-rose-400 text-xs inline-block"
              >
                🌸
              </motion.span>
            </div>
            <div className="text-sm font-extrabold text-white font-display">DayCare Edukatif</div>
            <span className="text-[10px] text-rose-200/70 block mt-0.5">Stimulasi Holistik</span>
          </motion.div>

          {/* Program 4: Shadow Teacher (Royal Sapphire) */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="relative group overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/10 backdrop-blur-md rounded-2xl p-3.5 border border-cyan-400/40 hover:border-cyan-300 transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300">Program 4</span>
              <motion.span 
                animate={{ rotate: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="text-cyan-400 text-xs inline-block"
              >
                💎
              </motion.span>
            </div>
            <div className="text-sm font-extrabold text-white font-display">Shadow Teacher</div>
            <span className="text-[10px] text-cyan-200/70 block mt-0.5">Pendamping Khusus</span>
          </motion.div>
        </div>
      </div>
      </GlowCursor>
    </motion.div>
  );
};
