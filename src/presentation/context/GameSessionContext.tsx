// filepath: src/presentation/context/GameSessionContext.tsx
'use client';

import { createContext, useContext } from 'react';

// Definim què és la informació de la sessió
interface GameSessionContextType {
  progress: number;
  currentIndex: number;
  totalChallenges: number;
  topicSlug: string;
}

const GameSessionContext = createContext<GameSessionContextType | null>(null);

export function useGameSessionContext() {
  const context = useContext(GameSessionContext);
  if (!context) {
    throw new Error('useGameSessionContext must be used within a GameSessionProvider');
  }
  return context;
}

export const GameSessionProvider = GameSessionContext.Provider;