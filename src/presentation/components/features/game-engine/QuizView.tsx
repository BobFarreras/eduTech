// filepath: src/presentation/components/features/game-engine/QuizView.tsx
'use client';

import { useState } from 'react';
import { Challenge, QuizContent } from '@/core/entities/challenge.entity';
import { clsx } from 'clsx'; 


// CORRECCIÓ CLAU: Afegim onNext a la interfície
interface QuizViewProps {
  challenge: Challenge;
  onNext: () => void; 
}

type AnswerStatus = 'IDLE' | 'CORRECT' | 'WRONG';

// CORRECCIÓ: Desempaquetem onNext de les props
export function QuizView({ challenge, onNext }: QuizViewProps) {
  const content = challenge.content as QuizContent;
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<AnswerStatus>('IDLE');

  const handleOptionClick = (index: number) => {
    if (status !== 'IDLE') return;

    setSelectedIndex(index);
    const isCorrect = index === content.correctOptionIndex;
    
    if (isCorrect) {
      setStatus('CORRECT');
    } else {
      setStatus('WRONG');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* ... (Codi de la barra de progrés i pregunta igual que abans) ... */}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {content.question}
        </h2>
      </div>

      <div className="grid gap-4">
        {content.options.map((option, index) => {
           // ... (Lògica de renderitzat d'opcions igual que abans) ...
           // Mantenir el mateix codi que tenies per als botons
           const isSelected = selectedIndex === index;
           const isCorrectAnswer = index === content.correctOptionIndex;
           
           let borderClass = 'border-slate-700 hover:border-blue-500 hover:bg-slate-750';
           if (status !== 'IDLE') {
             if (isSelected && status === 'CORRECT') borderClass = 'border-green-500 bg-green-500/10';
             else if (isSelected && status === 'WRONG') borderClass = 'border-red-500 bg-red-500/10';
             else if (status === 'WRONG' && isCorrectAnswer) borderClass = 'border-green-500/50 border-dashed';
             else borderClass = 'border-slate-800 opacity-50';
           }

           return (
            <button
              key={index}
              disabled={status !== 'IDLE'}
              onClick={() => handleOptionClick(index)}
              className={clsx(
                "w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 flex items-center group relative",
                borderClass,
                "bg-slate-800"
              )}
            >
              <div className={clsx(
                "w-8 h-8 flex items-center justify-center rounded-lg mr-4 font-bold text-sm transition-colors",
                isSelected ? "bg-transparent" : "bg-slate-700 text-slate-400"
              )}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg font-medium text-slate-200 group-hover:text-white">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* FOOTER AMB BOTÓ CONTINUAR */}
      {status !== 'IDLE' && (
        <div className={clsx(
          "fixed bottom-0 left-0 w-full p-8 border-t-2 animate-in slide-in-from-bottom-10",
          status === 'CORRECT' ? "bg-slate-900 border-green-600" : "bg-slate-900 border-red-600"
        )}>
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h3 className={clsx("text-xl font-bold mb-1", status === 'CORRECT' ? "text-green-400" : "text-red-400")}>
                {status === 'CORRECT' ? 'Genial!' : 'Incorrecte...'}
              </h3>
              <p className="text-slate-400 text-sm">{content.explanation}</p>
            </div>
            
            {/* AQUÍ ESTÀ LA CLAU: Cridem a onNext */}
            <button 
              onClick={onNext} 
              className={clsx(
                "px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105",
                status === 'CORRECT' ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
              )}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}