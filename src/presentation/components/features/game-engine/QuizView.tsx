// filepath: src/presentation/components/features/game-engine/QuizView.tsx
'use client';

import { useState } from 'react';
import { Challenge, QuizContent } from '@/core/entities/challenges/index';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { GameSessionLayout } from './layout/GameSessionLayout';
import { GameHeader } from './layout/GameHeader';
import { useTranslations } from 'next-intl';

interface QuizViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function QuizView({ challenge, onNext }: QuizViewProps) {
  const t = useTranslations('game'); 
  const content = challenge.content as QuizContent;

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return; 
    setSelectedOptionId(optionId);
    setIsSubmitted(true);
  };

  const handleContinue = () => {
    const selectedIndex = content.options.findIndex(o => o.id === selectedOptionId);
    const isCorrect = selectedIndex === content.correctOptionIndex;
    onNext(isCorrect);
  };

  const selectedIndex = content.options.findIndex(o => o.id === selectedOptionId);
  const isCorrectAnswer = selectedIndex === content.correctOptionIndex;

  // --- STYLES HELPER ---
  const getOptionStyles = (optionId: string, index: number) => {
    if (!isSubmitted) {
      return "border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-blue-500/50 text-slate-300 cursor-pointer active:scale-[0.98]";
    }
    const isCorrect = index === content.correctOptionIndex;
    const isSelected = optionId === selectedOptionId;

    if (isCorrect) return "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] font-bold";
    if (isSelected && !isCorrect) return "border-red-500 bg-red-500/10 text-red-400 opacity-90 shake-animation"; 
    return "border-slate-800 bg-slate-900/50 text-slate-600 opacity-40 grayscale";
  };

  // --- FOOTER (FEEDBACK) ---
  const Footer = isSubmitted ? (
    <div className={clsx(
        "w-full animate-in slide-in-from-bottom-4 duration-300",
        // El fons del footer canvia segons l'encert (feedback visual fort)
        isCorrectAnswer ? "border-t-4 border-green-500 bg-green-900/20" : "border-t-4 border-red-500 bg-red-900/20"
    )}>
       <div className="p-4 flex flex-col gap-4 backdrop-blur-md rounded-t-xl">
           <div className="flex items-start gap-3">
              <div className={clsx("p-2 rounded-full shrink-0", isCorrectAnswer ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                  {isCorrectAnswer ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                  <h3 className={clsx("font-bold text-lg", isCorrectAnswer ? "text-green-400" : "text-red-400")}>
                      {isCorrectAnswer ? t('feedback.correct') : t('feedback.incorrect')}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mt-1">
                      {content.explanation}
                  </p>
              </div>
           </div>
           
           <button 
             onClick={handleContinue}
             className={clsx(
                "w-full py-3.5 font-bold rounded-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg",
                isCorrectAnswer 
                ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20"
                : "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
             )}
           >
             {t('actions.continue')} <ArrowRight className="w-5 h-5" />
           </button>
       </div>
    </div>
  ) : <div className="h-4" />; // Espai buit per mantenir estructura

  return (
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 pt-4">
        
        {/* TARGETA DE PREGUNTA */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-xl font-bold text-white leading-relaxed relative z-10">
            {content.question}
          </h2>
        </div>

        {/* LLISTA D'OPCIONS */}
        <div className="grid gap-3 pb-8">
          {content.options.map((option, index) => {
              const isOptCorrect = index === content.correctOptionIndex;
              const isOptSelected = option.id === selectedOptionId;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isSubmitted}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden",
                    getOptionStyles(option.id, index)
                  )}
                >
                  <div className="flex items-center gap-4 z-10 w-full">
                      {/* Badge A, B, C... */}
                      <div className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors shrink-0",
                          isSubmitted && isOptCorrect ? "bg-green-500 border-green-500 text-slate-900" :
                          isSubmitted && isOptSelected ? "bg-red-500 border-red-500 text-white" :
                          "bg-slate-800 border-slate-600 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400"
                      )}>
                          {String.fromCharCode(65 + index)}
                      </div>
                      
                      <span className="font-medium text-base md:text-lg flex-1 leading-snug">{option.text}</span>
                  </div>
                </button>
              );
          })}
        </div>
      </div>
    </GameSessionLayout>
  );
}