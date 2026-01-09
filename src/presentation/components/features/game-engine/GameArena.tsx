// filepath: src/presentation/components/features/game-engine/GameArena.tsx
'use client';

import { useState } from 'react';
import { Challenge } from '@/core/entities/challenge.entity';
import { QuizView } from './QuizView';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface GameArenaProps {
  challenges: Challenge[]; // Rebem la llista completa
}

export function GameArena({ challenges }: GameArenaProps) {
  // ESTAT DE LA SESSIÓ
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const currentChallenge = challenges[currentIndex];
  
  // Càlcul de progrés (0% a 100%)
  const progressPercentage = ((currentIndex) / challenges.length) * 100;

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      // Passem al següent repte
      setCurrentIndex(prev => prev + 1);
    } else {
      // S'ha acabat la lliçó
      setIsSessionFinished(true);
    }
  };

  // 1. PANTALLA FINAL (RESUM)
  if (isSessionFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-in zoom-in-50 duration-500">
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-yellow-400" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Lliçó Completada!</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">
          Has superat {challenges.length} reptes sobre aquest tema.
          Has guanyat +{challenges.length * 10} XP.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
        >
          Tornar al Dashboard
        </Link>
      </div>
    );
  }

  // 2. PANTALLA DE JOC
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Barra de Progrés Global de la Sessió */}
      <div className="mb-6 px-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
          <span>Progrés</span>
          <span>{currentIndex + 1} / {challenges.length}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>

      {/* Renderitzem el repte actual amb una clau única per forçar el re-render net */}
      <div key={currentChallenge.id} className="animate-in slide-in-from-right-8 duration-300 fade-in">
        {currentChallenge.type === 'QUIZ' ? (
          <QuizView 
            challenge={currentChallenge} 
            onNext={handleNext} // Passem la funció de callback
          />
        ) : (
          <div className="text-center p-10 text-slate-500">
            Tipus {currentChallenge.type} no suportat encara.
            <button onClick={handleNext} className="block mx-auto mt-4 text-blue-400 underline">Saltar</button>
          </div>
        )}
      </div>
    </div>
  );
}