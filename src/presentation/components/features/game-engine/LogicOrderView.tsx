// filepath: src/presentation/components/features/game-engine/LogicOrderView.tsx
'use client';

import { useState } from 'react';
import { Challenge, LogicOrderContent, ChallengeOption } from '@/core/entities/challenge.entity';
import { RotateCcw, GripVertical, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Reorder, AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { GameSessionLayout } from './layout/GameSessionLayout';
import { Link } from '@/navigation';
import { X as CloseIcon } from 'lucide-react';
// 1. IMPORTAR HOOK DE TRADUCCIÓ
import { useTranslations } from 'next-intl';

interface LogicOrderViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
  sessionData: { progress: number; currentIndex: number; totalChallenges: number; topicSlug: string };
}

export function LogicOrderView({ challenge, onNext, sessionData }: LogicOrderViewProps) {
  // 2. INICIALITZAR HOOK
  const t = useTranslations('game');
  
  const content = challenge.content as LogicOrderContent;
  const [available, setAvailable] = useState<ChallengeOption[]>(content.items);
  const [selected, setSelected] = useState<ChallengeOption[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (item: ChallengeOption) => {
    if (hasSubmitted) return;
    setAvailable(prev => prev.filter(i => i.id !== item.id));
    setSelected(prev => [...prev, item]);
  };
  const handleDeselect = (item: ChallengeOption) => {
    if (hasSubmitted) return;
    setSelected(prev => prev.filter(i => i.id !== item.id));
    setAvailable(prev => [...prev, item]); 
  };
  const handleReset = () => {
    setAvailable(content.items); setSelected([]); setHasSubmitted(false); setIsCorrect(null);
  };
  const handleSubmit = () => {
    if (hasSubmitted) return;
    const currentOrder = selected.map(s => s.id);
    const correctOrder = [...content.items].map(i => i.id).sort(); 
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct); setHasSubmitted(true);
    if (correct) setTimeout(() => onNext(true), 1500);
  };

  const Header = (
    <div className="flex items-center gap-4 w-full">
        <Link href={`/learn/${sessionData.topicSlug}`} className="text-slate-400 hover:text-white p-1">
           <CloseIcon className="w-6 h-6" />
        </Link>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${sessionData.progress}%` }} 
            />
        </div>
    </div>
  );

  const Footer = (
    <div className="flex gap-3 w-full">
       <button 
          onClick={handleReset}
          className="p-4 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors border border-slate-700"
          title={t('actions.reset')} // Accessibilitat
       >
          <RotateCcw className="w-6 h-6" />
       </button>
       <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || hasSubmitted}
          className={clsx(
             "flex-1 p-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
             hasSubmitted 
                ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white")
                : selected.length === 0 
                    ? "bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed"
                    : "bg-blue-600 text-white border-b-4 border-blue-800 shadow-blue-500/20"
          )}
       >
          {/* 3. ÚS DE CLAUS DE TRADUCCIÓ */}
          {hasSubmitted ? (
             isCorrect ? t('feedback.correct') : t('feedback.incorrect')
          ) : t('actions.check')}
       </button>
    </div>
  );

  return (
    <GameSessionLayout header={Header} footer={Footer}>
      <LayoutGroup>
        <div className="flex flex-col h-full gap-2">
          
          <div className="shrink-0 text-center pb-2">
             <h2 className="text-lg font-bold text-white leading-tight">{content.description}</h2>
             {/* Subtítol opcional amb el nom del mode */}
             <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">
                {t('modes.logic_order.label')}
             </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-2">
             
             <div className="flex-1 bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 p-2 overflow-y-auto relative min-h-25">
                <span className="absolute top-2 right-2 text-[9px] text-slate-500 uppercase font-bold tracking-widest pointer-events-none">
                    {t('modes.logic_order.your_answer')}
                </span>
                
                {selected.length === 0 && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                      <GripVertical className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-xs">{t('modes.logic_order.placeholder')}</span>
                   </div>
                )}

                <Reorder.Group axis="y" values={selected} onReorder={setSelected} className="flex flex-col gap-2 w-full pb-8">
                   <AnimatePresence mode='popLayout'>
                     {selected.map((item, index) => (
                       <Reorder.Item key={item.id} value={item} dragListener={!hasSubmitted} layoutId={item.id}
                         className="relative p-3 rounded-lg border bg-slate-800 border-slate-600 flex items-center gap-3 select-none touch-none"
                       >
                          <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                          <span className="flex-1 text-sm font-medium">{item.text}</span>
                          {!hasSubmitted && <button onClick={() => handleDeselect(item)}><X className="w-4 h-4 text-slate-500" /></button>}
                       </Reorder.Item>
                     ))}
                   </AnimatePresence>
                </Reorder.Group>
             </div>

             <div className="shrink-0 h-auto max-h-[40%] overflow-y-auto bg-slate-950/30 rounded-xl border border-slate-800 p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   <AnimatePresence mode='popLayout'>
                      {available.map((item) => (
                         <motion.button
                            layoutId={item.id} key={item.id} onClick={() => handleSelect(item)} disabled={hasSubmitted}
                            className="p-3 rounded-lg bg-slate-800 border-b-2 border-slate-900 text-slate-300 text-xs font-medium text-left flex justify-between items-center group"
                         >
                            <span className="line-clamp-2">{item.text}</span>
                            <span className="text-blue-500 font-bold">+</span>
                         </motion.button>
                      ))}
                   </AnimatePresence>
                   {available.length === 0 && (
                       <div className="text-center text-xs text-slate-600 py-2">
                           {t('modes.logic_order.empty_options')}
                       </div>
                   )}
                </div>
             </div>

          </div>
        </div>
      </LayoutGroup>
    </GameSessionLayout>
  );
}