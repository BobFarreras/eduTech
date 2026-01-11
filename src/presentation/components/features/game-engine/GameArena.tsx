// filepath: src/presentation/components/features/game-engine/GameArena.tsx
'use client';

import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { useGameSession } from '@/presentation/hooks/game/useGameSession';
import { ChallengeRenderer } from './ChallengeRenderer';
import { GameResult } from './GameResult';
import { GameError } from './GameError';
import { Loader2 } from 'lucide-react';
// 1. Importem el Provider
import { GameSessionProvider } from '@/presentation/context/GameSessionContext';

interface GameArenaProps {
  challenges: Challenge[];
  topicSlug: string;
}

export function GameArena({ challenges, topicSlug }: GameArenaProps) {
  const {
    currentChallenge, currentIndex, totalChallenges, progress,
    status, result, error, handleNext, handleRetry
  } = useGameSession(challenges);

  if (status === 'SUBMITTING') return <FullScreenMsg><Loader2 className="w-12 h-12 animate-spin text-blue-500" /></FullScreenMsg>;
  if (status === 'SUCCESS' && result) return <GameResult xpEarned={result.xpEarned} newLevel={result.newLevel} leveledUp={result.leveledUp} topicSlug={topicSlug} />;
  if (status === 'ERROR' && error) return <GameError message={error} onRetry={handleRetry} />;

  // 2. EMBOLCALLEM EL JOC AMB EL CONTEXT
  // Ara tots els components fills poden accedir a 'progress' sense passar-ho per props.
  return (
    <GameSessionProvider value={{ 
        progress, 
        currentIndex, 
        totalChallenges, 
        topicSlug 
    }}>
        <ChallengeRenderer
            challenge={currentChallenge}
            onNext={handleNext}
            // JA NO PASSEM sessionData AQUÍ!
        />
    </GameSessionProvider>
  );
}

function FullScreenMsg({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">{children}</div>;
}