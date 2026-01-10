// filepath: src/presentation/components/features/game-engine/QuizView.tsx
'use client';

import { useState } from 'react';
import { Challenge, QuizContent } from '@/core/entities/challenge.entity';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';


interface QuizViewProps {
  challenge: Challenge;
  // ✅ CORRECCIÓ 1: La signatura ha de coincidir amb el que envia el pare
  onNext: (isCorrect: boolean) => void;
}

export function QuizView({ challenge, onNext }: QuizViewProps) {
  // const t = useTranslations('game.quiz'); 
  
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = challenge.content as QuizContent;

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return; 
    setSelectedOptionId(optionId);
    setIsSubmitted(true);
  };

  // ✅ CORRECCIÓ 2: Funció per gestionar el click a "Continuar"
  const handleContinue = () => {
    // Calculem si és correcte buscant l'índex de l'ID seleccionat
    const selectedIndex = content.options.findIndex(o => o.id === selectedOptionId);
    const isCorrect = selectedIndex === content.correctOptionIndex;
    
    // Avisem al pare amb el resultat
    onNext(isCorrect);
  };

  const getOptionStyles = (optionId: string, index: number) => {
    if (!isSubmitted) {
      return "border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-blue-500/50 text-slate-300 cursor-pointer active:scale-[0.98]";
    }

    const isCorrect = index === content.correctOptionIndex;
    const isSelected = optionId === selectedOptionId;

    if (isCorrect) {
      return "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] font-bold";
    }

    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-500/10 text-red-400 opacity-90 shake-animation"; 
    }

    return "border-slate-800 bg-slate-900/50 text-slate-600 opacity-40 grayscale";
  };

  // Helpers per determinar l'estat actual visualment
  const selectedIndex = content.options.findIndex(o => o.id === selectedOptionId);
  const isCorrectAnswer = selectedIndex === content.correctOptionIndex;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* PREGUNTA */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed relative z-10">
          {content.question}
        </h2>
      </div>

      {/* OPCIONS */}
      <div className="grid gap-3">
        {content.options.map((option, index) => {
            const isOptCorrect = index === content.correctOptionIndex;
            const isOptSelected = option.id === selectedOptionId;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={isSubmitted}
                className={clsx(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                  getOptionStyles(option.id, index)
                )}
              >
                <div className="flex items-center gap-4 z-10 w-full">
                    {/* Badge A, B, C... */}
                    <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors",
                        isSubmitted && isOptCorrect ? "bg-green-500 border-green-500 text-slate-900" :
                        isSubmitted && isOptSelected ? "bg-red-500 border-red-500 text-white" :
                        "bg-slate-800 border-slate-600 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400"
                    )}>
                        {String.fromCharCode(65 + index)}
                    </div>
                    
                    <span className="font-medium text-lg flex-1">{option.text}</span>

                    {isSubmitted && isOptCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-400 animate-in zoom-in spin-in-90 duration-300" />
                    )}
                    {isSubmitted && isOptSelected && !isOptCorrect && (
                        <XCircle className="w-6 h-6 text-red-400 animate-in zoom-in duration-300" />
                    )}
                </div>
              </button>
            );
        })}
      </div>

      {/* FEEDBACK & NEXT BUTTON */}
      {isSubmitted && (
        <div className={clsx(
            "rounded-2xl p-1 animate-in slide-in-from-bottom-2 duration-300 overflow-hidden shadow-2xl",
             isCorrectAnswer 
                ? "bg-linear-to-r from-green-500 to-emerald-600" 
                : "bg-linear-to-r from-red-500 to-rose-600"
        )}>
           <div className="bg-slate-950 rounded-xl p-5">
               <div className="flex items-start gap-4 mb-4">
                  <div className={clsx("p-3 rounded-full shrink-0", 
                      isCorrectAnswer ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                      {isCorrectAnswer ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                      <h3 className={clsx("font-bold text-lg mb-1", isCorrectAnswer ? "text-green-400" : "text-red-400")}>
                          {isCorrectAnswer ? "Correcte!" : "Incorrecte"}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                          {content.explanation}
                      </p>
                  </div>
               </div>

               <button 
                 // ✅ CORRECCIÓ 3: Cridem al handler que passa el boolean, no directament onNext
                 onClick={handleContinue}
                 className={clsx(
                    "w-full py-3.5 font-bold rounded-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg",
                    isCorrectAnswer 
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                 )}
               >
                 CONTINUAR <ArrowRight className="w-5 h-5" />
               </button>
           </div>
        </div>
      )}
    </div>
  );
}