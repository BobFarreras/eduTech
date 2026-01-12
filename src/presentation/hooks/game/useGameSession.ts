// filepath: src/presentation/hooks/game/useGameSession.ts
import { useState, useEffect } from 'react';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { submitSessionAction } from '@/presentation/actions/gamification/submit-session.action';
import { SessionResultDTO } from '@/application/dto/session-result.dto';

type GameStatus = 'PLAYING' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';

export function useGameSession(challenges: Challenge[]) {
  // Obtenim un ID únic per a la sessió actual (basat en el Topic)
  // Això evita que l'estat de "React" es barregi amb el de "SQL"
  const topicId = challenges[0]?.topicId || 'unknown_topic';
  const storageKey = `edutech_progress_${topicId}`;

  // 1. ESTAT INICIAL: Comencem a 0, però permetrem la "hidratació" posterior
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [result, setResult] = useState<SessionResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false); // Per evitar salts visuals

  // 2. RECUPERACIÓ (Hydration): Quan el component es munta, mirem si hi ha progrés guardat
  useEffect(() => {
    const savedIndex = sessionStorage.getItem(storageKey);
    if (savedIndex) {
      const parsedIndex = parseInt(savedIndex, 10);
      // Validem que l'índex guardat tingui sentit (no sigui major que els reptes actuals)
      if (!isNaN(parsedIndex) && parsedIndex < challenges.length) {
        setCurrentIndex(parsedIndex);
      }
    }
    setIsHydrated(true);
  }, [storageKey, challenges.length]);

  // 3. PERSISTÈNCIA: Cada cop que canvia l'índex, el guardem
  useEffect(() => {
    if (isHydrated && status === 'PLAYING') {
      sessionStorage.setItem(storageKey, currentIndex.toString());
    }
  }, [currentIndex, storageKey, isHydrated, status]);

  const currentChallenge = challenges[currentIndex];
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

  // Logica de Submit (sense canvis grans, només neteja del storage)
  useEffect(() => {
    if (status === 'SUBMITTING') {
      let isMounted = true;

      const submit = async () => {
        try {
          const challengeIds = challenges.map(c => c.id);
          
          if (!topicId || topicId === 'unknown_topic') throw new Error("Topic ID not found");

          const response = await submitSessionAction(challengeIds, topicId);

          if (!isMounted) return;

          if (response.success) {
            setResult(response.data);
            setStatus('SUCCESS');
            // ✅ NETEJA: Si acabem amb èxit, esborrem el progrés guardat
            sessionStorage.removeItem(storageKey);
          } else {
            setError(response.error);
            setStatus('ERROR');
          }
        } catch (err) {
            if (isMounted) {
                console.error(err);
                setError('CONNECTION_ERROR'); 
                setStatus('ERROR');
            }
        }
      };

      submit();

      return () => { isMounted = false; };
    }
  }, [status, challenges, topicId, storageKey]);

  return {
    currentChallenge,
    currentIndex,
    totalChallenges: challenges.length,
    progress,
    status,
    result,
    error,
    handleNext,
    handleRetry,
    isHydrated // Opcional: per si vols mostrar un spinner mentre llegeix del disc
  };
}