// filepath: src/presentation/components/features/learning-path/BossMarker.tsx
'use client';

import { useTranslations } from 'next-intl';
import { Medal, Trophy, Crown, Rocket, LucideIcon, Sparkles, Check } from 'lucide-react';
import { clsx } from 'clsx';

const ICONS: Record<string, LucideIcon> = {
  medal: Medal,
  trophy: Trophy,
  crown: Crown,
  rocket: Rocket
};

const THEMES: Record<string, { bg: string, border: string, shadow: string, ring: string }> = {
  'bg-blue-500':   { bg: 'bg-blue-600',   border: 'border-blue-800',   shadow: 'shadow-blue-600/40',   ring: 'border-blue-400' },
  'bg-orange-500': { bg: 'bg-orange-500', border: 'border-orange-700', shadow: 'shadow-orange-500/40', ring: 'border-orange-300' },
  'bg-red-600':    { bg: 'bg-red-600',    border: 'border-red-800',    shadow: 'shadow-red-600/40',    ring: 'border-red-400' },
  'bg-purple-600': { bg: 'bg-purple-600', border: 'border-purple-800', shadow: 'shadow-purple-600/40', ring: 'border-purple-400' },
  'bg-yellow-500': { bg: 'bg-yellow-500', border: 'border-yellow-700', shadow: 'shadow-yellow-500/40', ring: 'border-yellow-200' },
};

// 🟢 TEMA "COMPLETED" (Verd Maragda estàndard)
const COMPLETED_THEME = {
  bg: 'bg-emerald-500',
  border: 'border-emerald-700',
  shadow: 'shadow-emerald-500/40',
  ring: 'border-emerald-300'
};

interface BossMarkerProps {
  titleKey?: string;
  iconName?: string;
  colorClass?: string;
  isLocked: boolean;
  isCompleted: boolean; // 👈 NOVA PROP
}

export function BossMarker({ titleKey, iconName, colorClass, isLocked, isCompleted }: BossMarkerProps) {
  const t = useTranslations();
  const IconComponent = (iconName && ICONS[iconName]) ? ICONS[iconName] : Trophy;
  
  // 1. SELECCIÓ DE TEMA:
  // Si està complet -> Verd. Si no -> Color del Boss.
  const baseTheme = THEMES[colorClass || 'bg-yellow-500'] || THEMES['bg-yellow-500'];
  const theme = isCompleted ? COMPLETED_THEME : baseTheme;

  return (
    <div className={clsx(
      "relative flex flex-col items-center justify-center w-36 h-36 transition-all duration-500",
      // Si està complet o actiu, escala normal/gran. Si està bloquejat, normal.
      !isLocked ? "scale-110" : "opacity-100"
    )}>

      {/* --- AURA EXTERNA (Només si Actiu o Complet) --- */}
      {!isLocked && (
        <>
          <div className={clsx(
             "absolute inset-0 rounded-full border-2 border-dashed opacity-50 animate-[spin_10s_linear_infinite]",
             theme.ring
          )} />
          
          <div className={clsx(
             "absolute inset-4 rounded-full blur-xl opacity-30 animate-pulse",
             theme.bg
          )} />
        </>
      )}

      {/* --- NUCLI CENTRAL --- */}
      <div className={clsx(
        "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 z-10",
        "border-4 border-b-8",
        
        isLocked 
          ? "bg-slate-800 border-slate-950 text-slate-500" 
          : `${theme.bg} ${theme.border} text-white shadow-xl ${theme.shadow} animate-float`
      )}>
        
        {/* ICONA */}
        <div className="relative z-10">
           <IconComponent className={clsx(
             "transition-transform duration-300",
             isLocked 
               ? "w-10 h-10 opacity-50 grayscale"
               : "w-12 h-12 drop-shadow-md animate-bounce-sm"
           )} />
           
           {/* Checkmark de victòria si està complet */}
           {isCompleted && (
             <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 rounded-full p-1 shadow-sm border-2 border-emerald-100">
                <Check className="w-4 h-4 stroke-[4]" />
             </div>
           )}

           {/* Espurnes (Només si actiu/complet) */}
           {!isLocked && !isCompleted && (
             <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-white animate-pulse" />
           )}
        </div>

        {/* Gloss */}
        {!isLocked && (
           <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* --- ETIQUETA --- */}
      <div className={clsx(
        "absolute -bottom-6 px-4 py-1.5 rounded-full border shadow-md z-20 min-w-[130px] text-center transition-transform",
        isLocked 
          ? "bg-slate-900 border-slate-950 text-slate-500"
          : `${theme.bg} ${theme.border} border-b-4 -translate-y-1`
      )}>
        <span className={clsx(
          "text-[10px] font-black uppercase tracking-[0.2em] leading-none",
           isLocked ? "text-slate-500" : "text-white"
        )}>
          {titleKey ? t(titleKey) : 'BOSS'}
        </span>
      </div>

    </div>
  );
}