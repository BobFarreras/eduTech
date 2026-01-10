// filepath: src/presentation/components/features/game-engine/GameArena.tsx
'use client';

import { Challenge } from '@/core/entities/challenge.entity';
import { useGameSession } from '@/presentation/hooks/game/useGameSession';
import { ChallengeRenderer } from './ChallengeRenderer';
import { GameResult } from './GameResult';
import { GameError } from './GameError';
import { Loader2} from 'lucide-react';


// NO importis el layout aquí directament si vols que cada joc tingui el seu footer propi.
// Però per mantenir consistència, podem passar el footer des del ChallengeRenderer.
// REVISIÓ: El GameArena només proveeix el context. El layout el controlarà el fill.

// MIRA BÉ EL CANVI D'ESTRATÈGIA: 
// Passem el control del layout al component específic (LogicOrderView) 
// perquè ell sap quin botó necessita (Verificar, Continuar...).
// GameArena només retorna el contingut pur.

interface GameArenaProps {
  challenges: Challenge[];
  topicSlug: string;
}

export function GameArena({ challenges, topicSlug }: GameArenaProps) {
  const {
    currentChallenge, currentIndex, totalChallenges, progress,
    status, result, error, handleNext, handleRetry
  } = useGameSession(challenges);

  // Estats globals (Càrrega/Error) - Ocupen tota la pantalla
  if (status === 'SUBMITTING') return <FullScreenMsg><Loader2 className="w-12 h-12 animate-spin text-blue-500" /></FullScreenMsg>;
  if (status === 'SUCCESS' && result) return <GameResult xpEarned={result.xpEarned} newLevel={result.newLevel} leveledUp={result.leveledUp} topicSlug={topicSlug} />;
  if (status === 'ERROR' && error) return <GameError message={error} onRetry={handleRetry} />;

  // Renderitzem el joc actual.
  // Passem les dades de sessió (progress, etc.) com a props al Renderer 
  // perquè el component final (LogicOrderView) pugui muntar el GameSessionLayout complet.
  return (
    <ChallengeRenderer
      challenge={currentChallenge}
      onNext={handleNext}
      // 👇 Aquest objecte ha de coincidir amb la interfície SessionData
      sessionData={{
        progress,
        currentIndex,
        totalChallenges,
        topicSlug
      }}
    />
  );
}

function FullScreenMsg({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">{children}</div>;
}