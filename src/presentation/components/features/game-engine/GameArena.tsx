// filepath: src/presentation/components/features/game-engine/GameArena.tsx
'use client';

import { Challenge } from '@/core/entities/challenge.entity';
import { useGameSession } from '@/presentation/hooks/game/useGameSession';
// ❌ ELIMINA: import { QuizView } from './QuizView'; (Ja no cal aquí)
import { ChallengeRenderer } from './ChallengeRenderer'; // ✅ AQUEST ÉS EL BO
import { GameResult } from './GameResult';
import { GameError } from './GameError';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GameArenaProps {
  challenges: Challenge[];
  topicSlug: string;
}

export function GameArena({ challenges, topicSlug }: GameArenaProps) {
  const t = useTranslations('game.arena');
  
  const { 
    currentChallenge, 
    currentIndex, 
    totalChallenges, 
    progress, 
    status, 
    result, 
    error, 
    handleNext, 
    handleRetry 
  } = useGameSession(challenges);

  // 1. ESTAT: CARREGANT
  if (status === 'SUBMITTING') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  // 2. ESTAT: ÈXIT
  if (status === 'SUCCESS' && result) {
    return (
        <GameResult 
            xpEarned={result.xpEarned} 
            newLevel={result.newLevel} 
            leveledUp={result.leveledUp} 
            topicSlug={topicSlug}
        />
    );
  }

  // 3. ESTAT: ERROR
  if (status === 'ERROR' && error) {
    return <GameError message={error} onRetry={handleRetry} />;
  }

  // 4. ESTAT: JUGANT
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* BARRA DE PROGRÉS */}
      <div className="mb-8 px-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
          <span>{t('progress')}</span>
          <span>{currentIndex + 1} / {totalChallenges}</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* ZONA DE JOC */}
      <div className="animate-in slide-in-from-right-8 duration-300">
        
        {/* 🛑 ASSEGURA'T QUE NOMÉS TENS AIXÒ! 
            Si tens un 'if (type === QUIZ)' aquí a sobre, ESBORRA'L.
        */}
        
        <ChallengeRenderer 
           challenge={currentChallenge}
           onNext={handleNext}
        />

      </div>
    </div>
  );
}