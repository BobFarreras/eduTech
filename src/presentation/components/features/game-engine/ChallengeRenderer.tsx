// filepath: src/presentation/components/features/game-engine/ChallengeRenderer.tsx
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { QuizView } from './QuizView';
import { MatchingView } from './MatchingView';
import { CodeFixView } from './CodeFixView';
import { TerminalView } from './TerminalView';
import { LogicOrderView } from './LogicOrderView';

// Definició de les dades de sessió (Tipatge estricte)
export interface SessionData {
  progress: number;
  currentIndex: number;
  totalChallenges: number;
  topicSlug: string;
}

interface ChallengeRendererProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
  sessionData: SessionData; // 👈 Aquesta prop és OBLIGATÒRIA
}

export function ChallengeRenderer({ challenge, onNext, sessionData }: ChallengeRendererProps) {

  switch (challenge.type) {
    // ----------------------------------------------------------------------
    // ⚠️ NOTES D'ARQUITECTURA:
    // Els jocs QUIZ, MATCHING i CODE_FIX encara no usen el nou 'GameSessionLayout'.
    // Per això no els passem 'sessionData'.
    // Si en el futur els actualitzes al nou disseny, hauràs d'afegir la prop aquí.
    // ----------------------------------------------------------------------

    case 'QUIZ':
      return <QuizView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'MATCHING':
      return <MatchingView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'CODE_FIX':
      return <CodeFixView key={challenge.id} challenge={challenge} onNext={onNext} />;

    // ----------------------------------------------------------------------
    // ✅ JOCS ACTUALITZATS AL NOU LAYOUT RESPONSIVE (AMB HEADER/FOOTER)
    // ----------------------------------------------------------------------

    case 'TERMINAL':
      return (
        <TerminalView 
          key={challenge.id} 
          challenge={challenge} 
          onNext={onNext} 
          sessionData={sessionData} // 👈 AFEGIT: Soluciona l'error TS2741
        />
      );

    case 'LOGIC_ORDER':
      return (
        <LogicOrderView 
          key={challenge.id} 
          challenge={challenge} 
          onNext={onNext} 
          sessionData={sessionData} 
        />
      );

    default:
      return <div className="text-red-500 p-4">Tipus no suportat: {challenge.type}</div>;
  }
}