// filepath: src/presentation/components/features/game-engine/GameArena.tsx
'use client';

import { useState, useEffect } from 'react';
import { Challenge } from '@/core/entities/challenge.entity';
import { QuizView } from './QuizView';
import Link from 'next/link';
import { Trophy, Loader2, Star } from 'lucide-react'; 
import { submitSessionAction } from '@/presentation/actions/gamification/submit-session.action';

interface GameArenaProps {
  challenges: Challenge[];
}

// Definim un tipus local per al resultat (per no usar any)
type SessionResultUI = {
  xpEarned: number;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
};

export function GameArena({ challenges }: GameArenaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  
  // Estats de Càrrega i Resultat
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResultUI | null>(null);

  const currentChallenge = challenges[currentIndex];
  const progressPercentage = ((currentIndex) / challenges.length) * 100;

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  };

  // EFFECT: Guardar automàticament al finalitzar
  useEffect(() => {
    if (isSessionFinished && !isSubmitting && !sessionResult) {
      const saveProgress = async () => {
        setIsSubmitting(true);
        
        // Extraiem les dades necessàries
        const challengeIds = challenges.map(c => c.id);
        const topicId = challenges[0].topicId; 

        const response = await submitSessionAction(challengeIds, topicId);
        
        if (response.success) {
          setSessionResult(response.data);
        }
        setIsSubmitting(false);
      };

      saveProgress();
    }
  }, [isSessionFinished, challenges, isSubmitting, sessionResult]); 

  // --- RENDERITZAT: PANTALLA FINAL ---
  if (isSessionFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-in zoom-in-50 duration-500">
        <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 relative">
          <Trophy className="w-16 h-16 text-yellow-400" />
          {sessionResult?.leveledUp && (
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
              LEVEL UP!
            </div>
          )}
        </div>
        
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
          Lliçó Completada!
        </h2>
        
        {isSubmitting ? (
          <div className="flex items-center text-slate-400 bg-slate-800/50 px-6 py-3 rounded-full">
            <Loader2 className="w-5 h-5 mr-3 animate-spin text-blue-400" />
            Sincronitzant amb el servidor...
          </div>
        ) : sessionResult ? (
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
             <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                <span className="text-slate-400">XP Guanyada</span>
                <span className="text-2xl font-bold text-green-400 flex items-center">
                  +{sessionResult.xpEarned} <Star className="w-5 h-5 ml-1 fill-green-400" />
                </span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400">Nivell Actual</span>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-white">{sessionResult.newLevel}</span>
                  <span className="text-sm text-slate-500 ml-2">(Total: {sessionResult.newTotalXp} XP)</span>
                </div>
             </div>
          </div>
        ) : (
          <p className="text-red-400 mb-4 bg-red-900/20 px-4 py-2 rounded">
            Hi ha hagut un error guardant el progrés.
          </p>
        )}

        <Link 
          href="/" 
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
        >
          Tornar al Dashboard
        </Link>
      </div>
    );
  }

  // --- RENDERITZAT: JOC EN CURS ---
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Barra de Progrés */}
      <div className="mb-8 px-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
          <span>Progrés de la lliçó</span>
          <span>{currentIndex + 1} / {challenges.length}</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>

      <div key={currentChallenge.id} className="animate-in slide-in-from-right-8 duration-300 fade-in">
        {currentChallenge.type === 'QUIZ' ? (
          <QuizView challenge={currentChallenge} onNext={handleNext} />
        ) : (
           <div className="text-center p-12 bg-slate-800 rounded-xl border border-dashed border-slate-600 text-slate-400">
             <p className="mb-4">Tipus de repte <strong>{currentChallenge.type}</strong> en construcció.</p>
             <button onClick={handleNext} className="text-blue-400 hover:text-blue-300 underline font-medium">Saltar aquest repte</button>
           </div>
        )}
      </div>
    </div>
  );
}