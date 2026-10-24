import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'full' | 'icon-only';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'full'
}) => {
  const sizeMap = {
    sm: { img: 'h-8 w-auto', text: 'text-sm', sub: 'text-[9px]', ring: 'p-1', star: 'w-2.5 h-2.5' },
    md: { img: 'h-11 w-auto', text: 'text-base', sub: 'text-[11px]', ring: 'p-1.5', star: 'w-3 h-3' },
    lg: { img: 'h-16 w-auto', text: 'text-2xl', sub: 'text-xs', ring: 'p-2', star: 'w-4 h-4' },
    xl: { img: 'h-24 w-auto', text: 'text-3xl', sub: 'text-sm', ring: 'p-3', star: 'w-5 h-5' }
  };

  const currentSize = sizeMap[size];
  const defaultLogoPath = '/assets/aistudio/Desain_tanpa_judul_20250712_130635_0000__1__c8a27306.png';

  let schoolName = 'LITTLE STAR';
  let schoolUnit = 'LEARNING CENTER';
  let logoPath = defaultLogoPath;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { settings } = useSiteSettings();
    if (settings) {
      if (settings.schoolName) schoolName = settings.schoolName;
      if (settings.schoolUnit) schoolUnit = settings.schoolUnit;
      if (settings.logoUrl) logoPath = settings.logoUrl;
    }
  } catch (e) {
    // fallback
  }

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Luminous luxury ambient aura */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        
        <div className={`relative bg-white/95 backdrop-blur-md rounded-2xl ${currentSize.ring} shadow-md shadow-amber-500/10 border border-amber-200/60 transition-transform group-hover:scale-105 duration-200`}>
          <img
            src={logoPath}
            alt={`${schoolName} ${schoolUnit}`}
            referrerPolicy="no-referrer"
            className={`${currentSize.img} object-contain`}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback Star Sun in case image load delay */}
          <div
            style={{ display: 'none' }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 items-center justify-center text-white font-bold shadow-md shadow-amber-200"
          >
            ⭐
          </div>
        </div>
      </div>

      {showText && variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 bg-clip-text text-transparent ${currentSize.text} font-display uppercase`}>
              {schoolName}
            </span>
            <Sparkles className={`${currentSize.star} text-amber-500 animate-pulse`} />
          </div>
          <span className={`font-extrabold tracking-widest bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent uppercase ${currentSize.sub} mt-0.5`}>
            {schoolUnit}
          </span>
        </div>
      )}
    </div>
  );
};
