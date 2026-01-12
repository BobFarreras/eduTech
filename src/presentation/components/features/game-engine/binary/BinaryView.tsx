// filepath: src/presentation/components/features/game-engine/binary/BinaryView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Challenge, BinaryContent } from '@/core/entities/challenges';
import { Check, X, ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { GameSessionLayout } from '../layout/GameSessionLayout';
import { GameHeader } from '../layout/GameHeader';
import { useTranslations, useLocale } from 'next-intl';

interface BinaryViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function BinaryView({ challenge, onNext }: BinaryViewProps) {
  const t = useTranslations('game');
  const locale = useLocale(); 
  const content = challenge.content as BinaryContent;

  // 1. ESTAT INICIAL (Sempre net perquè el component es recrea de zero)
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  
  // 2. GHOST CLICK PROTECTION
  // Comencem bloquejats per evitar clics accidentals de la pantalla anterior
  const [isInteractive, setIsInteractive] = useState(false);

  // Aquest Effect només s'executa 1 cop quan el component "neix" (Mount)
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsInteractive(true);
    }, 500); // 0.5 segons de "cooldown"

    return () => clearTimeout(timer);
  }, []); // Array buit = Només al muntar. No depèn de challenge.id

  // --- HELPER TEXT ---
  const getLocalizedText = (text: string | Record<string, string> | undefined) => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[locale] || text['ca'] || text['en'] || Object.values(text)[0] || '';
  };

  if (!content) return null;

  const handleDecision = (userSaysTrue: boolean) => {
    // Si encara estem en "cooldown" o ja hem contestat, ignorem el clic
    if (!isInteractive || status !== 'IDLE') return;

    const isCorrect = userSaysTrue === content.isTrue;
    setStatus(isCorrect ? 'CORRECT' : 'WRONG');
  };

  const handleManualNext = () => {
    onNext(status === 'CORRECT');
  };

  // --- FOOTER ---
  const Footer = (
    <div className={clsx(
        "w-full transition-all duration-300 ease-out transform z-50",
        status === 'IDLE' ? "translate-y-full opacity-0 h-0" : "translate-y-0 opacity-100"
    )}>
       {status !== 'IDLE' && (
        <div className={clsx(
            "p-6 pb-8 flex flex-col gap-4 backdrop-blur-xl border-t-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
            status === 'CORRECT' ? "bg-green-950/90 border-green-500" : "bg-red-950/90 border-red-500"
        )}>
            <div className="flex items-start gap-4">
               <div className={clsx(
                   "p-3 rounded-full shrink-0 shadow-lg animate-in zoom-in", 
                   status === 'CORRECT' ? "bg-green-500 text-white" : "bg-red-500 text-white"
               )}>
                  {status === 'CORRECT' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
               </div>
               <div className="flex-1 space-y-1">
                   <h3 className={clsx("font-black text-xl tracking-tight", status === 'CORRECT' ? "text-green-400" : "text-red-400")}>
                       {status === 'CORRECT' ? t('feedback.correct') : t('feedback.incorrect')}
                   </h3>
                   <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                       {getLocalizedText(content.explanation)}
                   </p>
               </div>
            </div>
            
            <button 
                onClick={handleManualNext}
                className={clsx(
                    "w-full py-4 font-bold text-lg rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl mt-2 animate-in slide-in-from-bottom-2 fade-in duration-500",
                    status === 'CORRECT' ? "bg-green-600 text-white" : "bg-red-600 text-white"
                )}
            >
                {t('arena.continue_btn')} <ArrowRight className="w-6 h-6" />
            </button>
        </div>
       )}
    </div>
  );

  return (
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      <div className="w-full max-w-lg mx-auto flex flex-col h-full px-4 py-4 md:py-8 gap-4 md:gap-8">
        
        {/* TARGETA */}
        <div className="flex-1 flex flex-col justify-center min-h-0 relative"> 
            <div className={clsx(
              "relative w-full h-full max-h-125 rounded-4xl border-4 shadow-2xl flex flex-col items-center justify-center p-6 md:p-10 text-center transition-all duration-500 transform overflow-hidden bg-slate-800",
              status === 'CORRECT' && "border-green-500 bg-green-900/20 shadow-green-500/20",
              status === 'WRONG' && "border-red-500 bg-red-900/20 shadow-red-500/20",
              status === 'IDLE' && "border-slate-700 shadow-black/50"
            )}>
              <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-0"
                   style={{ opacity: status !== 'IDLE' ? 0.2 : 0 }}>
                  {status === 'CORRECT' ? <Check className="w-64 h-64 text-green-500" /> : status === 'WRONG' ? <X className="w-64 h-64 text-red-500" /> : null}
              </div>

              <div className={clsx("relative z-10 transition-all duration-300 flex flex-col gap-6 items-center w-full", status !== 'IDLE' && "scale-95")}>
                  <div className="inline-flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-inner">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="font-bold tracking-widest text-[10px] uppercase">RÀPID</span>
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white leading-snug select-none text-balance">
                      {getLocalizedText(content.statement)}
                  </h2>
              </div>
            </div>
        </div>

        {/* BOTONS */}
        <div className={clsx(
            "grid grid-cols-2 gap-4 w-full transition-all duration-500",
            status !== 'IDLE' ? "opacity-0 translate-y-20 pointer-events-none h-0" : "opacity-100 translate-y-0 h-auto pb-4",
            !isInteractive && "opacity-50 grayscale" // Feedback visual del cooldown
        )}>
           <button
              onClick={() => handleDecision(false)}
              disabled={!isInteractive} 
              className="group relative bg-red-600/10 hover:bg-red-600 active:bg-red-700 border-2 border-red-600/40 hover:border-red-500 rounded-2xl py-6 md:py-8 flex flex-col items-center justify-center gap-2 transition-all active:scale-90 touch-manipulation shadow-lg disabled:cursor-not-allowed"
           >
              <X className="w-8 h-8 md:w-10 md:h-10 text-red-500 group-hover:text-white transition-colors" />
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-red-400 group-hover:text-white transition-colors">Fals</span>
           </button>

           <button
              onClick={() => handleDecision(true)}
              disabled={!isInteractive} 
              className="group relative bg-green-600/10 hover:bg-green-600 active:bg-green-700 border-2 border-green-600/40 hover:border-green-500 rounded-2xl py-6 md:py-8 flex flex-col items-center justify-center gap-2 transition-all active:scale-90 touch-manipulation shadow-lg disabled:cursor-not-allowed"
           >
              <Check className="w-8 h-8 md:w-10 md:h-10 text-green-500 group-hover:text-white transition-colors" />
              <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-green-400 group-hover:text-white transition-colors">Cert</span>
           </button>
        </div>
      </div>
    </GameSessionLayout>
  );
}