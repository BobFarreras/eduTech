// filepath: src/presentation/components/features/game-engine/GameResult.tsx
import { Trophy, Star } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface GameResultProps {
  xpEarned: number;
  newLevel: number; // Ara el farem servir!
  leveledUp: boolean;
}

export function GameResult({ xpEarned, newLevel, leveledUp }: GameResultProps) {
  const t = useTranslations('game.arena');

  return (
    <div className="flex flex-col items-center animate-in zoom-in-50">
      <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 relative">
        <Trophy className="w-16 h-16 text-yellow-400" />
        {leveledUp && (
          <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
            {t('level_up')}
          </div>
        )}
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-6">{t('lesson_complete')}</h2>
      
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-sm mb-6 space-y-4">
         <div className="flex justify-between items-center text-slate-300">
            <span>{t('xp_earned')}</span>
            <span className="text-green-400 font-bold flex gap-1 items-center">
                +{xpEarned} <Star className="w-4 h-4 fill-green-400" />
            </span>
         </div>
         {/* CORRECCIÓ: Usem newLevel per que no sigui unused variable */}
         <div className="flex justify-between items-center text-slate-300 pt-4 border-t border-slate-700">
            <span>Nivell Actual</span>
            <span className="text-white font-bold text-xl">{newLevel}</span>
         </div>
      </div>

      <Link href="/dashboard">
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all">
            {t('dashboard_btn')}
        </button>
      </Link>
    </div>
  );
}