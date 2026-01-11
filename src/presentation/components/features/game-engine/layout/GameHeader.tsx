// filepath: src/presentation/components/features/game-engine/layout/GameHeader.tsx
'use client';

import { X } from 'lucide-react';
import { Link } from '@/navigation';
import { useGameSessionContext } from '@/presentation/context/GameSessionContext';
import { useTranslations } from 'next-intl'; // 1. Importem hook

interface GameHeaderProps {
  rightContent?: React.ReactNode;
}

export function GameHeader({ rightContent }: GameHeaderProps) {
  const t = useTranslations('game'); // 2. Namespace 'game'
  const { progress, currentIndex, totalChallenges, topicSlug } = useGameSessionContext();

  const visualProgress = Math.max(progress, 5);

  return (
    <div className="flex items-center gap-4 w-full h-full max-w-5xl mx-auto">
      <Link 
        href={`/learn/${topicSlug}`} 
        className="text-slate-400 hover:text-white p-2 transition-colors hover:bg-white/10 rounded-xl"
        aria-label={t('arena.quit')} // Accesibilitat
      >
        <X className="w-6 h-6" />
      </Link>

      <div className="flex-1 flex flex-col justify-center gap-2">
         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">
            {/* 3. Usem la clau correcta */}
            <span>{t('arena.progress')}</span>
            <span>{currentIndex + 1} / {totalChallenges}</span>
         </div>

         <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 relative backdrop-blur-sm">
            <div 
              className="h-full rounded-full relative overflow-hidden transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ width: `${visualProgress}%` }}
            >
               <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400"></div>
               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
               <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[2px]"></div>
            </div>
         </div>
      </div>

      <div className="w-8 flex justify-end">
          {rightContent}
      </div>
    </div>
  );
}