import { Challenge } from '@/core/entities/challenge.entity';
import { QuizView } from './QuizView';
import { MatchingView } from './MatchingView'; // <--- IMPORTAR
import { CodeFixView } from './CodeFixView';   // <--- IMPORTAR

interface ChallengeRendererProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function ChallengeRenderer({ challenge, onNext }: ChallengeRendererProps) {
  
  switch (challenge.type) {
    case 'QUIZ':
      return (
        <QuizView 
          key={challenge.id}
          challenge={challenge} 
          onNext={onNext} 
        />
      );
    
    case 'MATCHING':
      return (
         <MatchingView 
            key={challenge.id}
            challenge={challenge} 
            onNext={onNext} 
         />
      );

    case 'CODE_FIX':
       return (
          <CodeFixView 
             key={challenge.id}
             challenge={challenge}
             onNext={onNext}
          />
       );

    default:
      return <div className="text-red-500">Tipus de joc no suportat: {challenge.type}</div>;
  }
}