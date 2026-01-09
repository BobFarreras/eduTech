// filepath: src/presentation/hooks/game/useGameSession.ts
import { useState, useEffect } from 'react';
import { Challenge } from '@/core/entities/challenge.entity';
import { submitSessionAction } from '@/presentation/actions/gamification/submit-session.action';
import { SessionResultDTO } from '@/application/dto/session-result.dto';

type GameStatus = 'PLAYING' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';

export function useGameSession(challenges: Challenge[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  
  // CORRECCIÓ: Usem el tipus estricte en lloc de 'any'
  const [result, setResult] = useState<SessionResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentChallenge = challenges[currentIndex];
  // Validació per evitar NaN si l'array és buit
  const progress = challenges.length > 0 ? ((currentIndex) / challenges.length) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStatus('SUBMITTING');
    }
  };

  const handleRetry = () => {
    setError(null);
    setStatus('SUBMITTING');
  };

  useEffect(() => {
    if (status === 'SUBMITTING') {
      let isMounted = true; // Evitem actualitzacions si el component es desmunta

      const submit = async () => {
        try {
          const challengeIds = challenges.map(c => c.id);
          const topicId = challenges[0]?.topicId;

          if (!topicId) throw new Error("Topic ID not found");

          const response = await submitSessionAction(challengeIds, topicId);

          if (!isMounted) return;

          if (response.success) {
            setResult(response.data); // Ara TypeScript sap que això és SessionResultDTO
            setStatus('SUCCESS');
          } else {
            setError(response.error);
            setStatus('ERROR');
          }
        } catch (err) {
            if (isMounted) {
                console.error(err);
                setError('CONNECTION_ERROR'); // Usem una clau per traduir després
                setStatus('ERROR');
            }
        }
      };

      submit();

      return () => { isMounted = false; };
    }
  }, [status, challenges]);

  return {
    currentChallenge,
    currentIndex,
    totalChallenges: challenges.length,
    progress,
    status,
    result,
    error,
    handleNext,
    handleRetry
  };
}