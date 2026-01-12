// filepath: src/presentation/components/features/game-engine/ChallengeRenderer.tsx
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { QuizView } from './QuizView';
import { MatchingView } from './MatchingView';
import { CodeFixView } from './CodeFixView';
import { TerminalView } from './TerminalView';
import { LogicOrderView } from './LogicOrderView';
import { BinaryView } from './binary/BinaryView'; // 👈 Importem
import { TheoryView } from './TheoryView';
import { CtfView } from './CtfView';
// Definició de les dades de sessió (Tipatge estricte)

interface ChallengeRendererProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function ChallengeRenderer({ challenge, onNext }: ChallengeRendererProps) {
  // ⚠️ AFEGIM key={challenge.id} A TOTS ELS COMPONENTS
  // Això reseteja l'estat (useState) i les animacions CSS quan canvia el repte.

  switch (challenge.type) {
    case 'QUIZ':
      return <QuizView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'CODE_FIX':
      return <CodeFixView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'TERMINAL':
      return <TerminalView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'MATCHING':
      return <MatchingView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'LOGIC_ORDER':
      return <LogicOrderView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'BINARY_DECISION':
      return <BinaryView key={challenge.id} challenge={challenge} onNext={onNext} />;

    case 'THEORY':
      return <TheoryView key={challenge.id} challenge={challenge} onNext={onNext} />;
    case 'CTF':
      return <CtfView key={challenge.id} challenge={challenge} onNext={onNext} />;
    default:
      return <div>Tipus desconegut</div>;
  }
}