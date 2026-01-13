// filepath: src/presentation/components/features/game-engine/LogicOrderView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Challenge, LogicOrderContent, ChallengeOption } from '@/core/entities/challenges/index';
import { RotateCcw, Check, GripVertical, X, ArrowDown, Info, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';
import { Reorder, AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { GameSessionLayout } from './layout/GameSessionLayout';
import { GameHeader } from './layout/GameHeader';
import { useTranslations } from 'next-intl';

interface LogicOrderViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function LogicOrderView({ challenge, onNext }: LogicOrderViewProps) {
  const t = useTranslations('game');
  const content = challenge.content as LogicOrderContent;

  // ESTADIS
  const [available, setAvailable] = useState<ChallengeOption[]>(content.items);
  const [selected, setSelected] = useState<ChallengeOption[]>([]);
  
  // ESTAT DEL JOC: 'idle' | 'checking' | 'success' | 'error'
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [showHelp, setShowHelp] = useState(false);

  // Inicialització segura (mescla les opcions disponibles al principi)
  useEffect(() => {
    // Opcional: barrejar items inicialment si no venen barrejats del back
    // setAvailable([...content.items].sort(() => Math.random() - 0.5));
  }, []);

  // --- LOGICA D'INTERACCIÓ ---

  const handleSelect = (item: ChallengeOption) => {
    if (status === 'success') return;
    setStatus('idle');
    setAvailable(prev => prev.filter(i => i.id !== item.id));
    setSelected(prev => [...prev, item]);
  };

  const handleDeselect = (item: ChallengeOption) => {
    if (status === 'success') return;
    setStatus('idle');
    setSelected(prev => prev.filter(i => i.id !== item.id));
    setAvailable(prev => [...prev, item]);
  };

  const handleReset = () => {
    setAvailable(content.items);
    setSelected([]);
    setStatus('idle');
  };

  const handleSubmit = () => {
    if (status === 'success') return;
    
    setStatus('checking');
    
    // Validació
    const currentOrderIds = selected.map(s => s.id);
    const correctOrderIds = [...content.items]
      .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Assumint que ID defineix l'ordre, o usar una propietat 'order'
      .map(i => i.id); 

    // NOTA: La validació real hauria de dependre de com guardes l'ordre correcte a la BD. 
    // Si l'array original `content.items` JA ve en l'ordre correcte (habitual):
    const targetIds = content.items.map(i => i.id);

    // Comparació simple
    const isCorrect = JSON.stringify(currentOrderIds) === JSON.stringify(targetIds);

    if (isCorrect) {
      setStatus('success');
      setTimeout(() => onNext(true), 1500);
    } else {
      setStatus('error');
      // Treure l'estat d'error després d'un moment
      setTimeout(() => setStatus('idle'), 800);
    }
  };

  // --- RENDERITZAT AUXILIAR ---
  
  // Calculem quants slots buits queden
  const totalSlots = content.items.length;
  const emptySlots = totalSlots - selected.length;

  // --- FOOTER ---
  const Footer = (
    <div className="flex gap-3 w-full max-w-md mx-auto">
      <button
        onClick={handleReset}
        disabled={selected.length === 0 || status === 'success'}
        className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors border border-slate-700 disabled:opacity-50"
        title={t('actions.reset')}
      >
        <RotateCcw className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleSubmit}
        disabled={selected.length < totalSlots || status === 'success'}
        className={clsx(
          "flex-1 p-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
          status === 'idle' && "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
          status === 'error' && "bg-red-500 text-white animate-shake", // Afegir keyframes 'shake' al CSS global
          status === 'success' && "bg-emerald-500 text-white",
          selected.length < totalSlots && status === 'idle' && "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        {status === 'checking' && <span className="animate-spin">⏳</span>}
        {status === 'success' && <><Check className="w-6 h-6" /> {t('feedback.correct')}</>}
        {status === 'error' && <><X className="w-6 h-6" /> {t('feedback.incorrect')}</>}
        {status === 'idle' && t('actions.check')}
      </button>
    </div>
  );

  return (
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      <LayoutGroup>
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full">

          {/* 1. ENUNCIAT I AJUDA */}
          <div className="shrink-0 text-center pb-4 px-2">
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-sm">
              {content.description}
            </h2>
            
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-2 py-1 rounded-md border border-blue-900">
                 {t('modes.logic_order.label')}
               </span>
               <button 
                 onClick={() => setShowHelp(!showHelp)}
                 className="text-slate-500 hover:text-yellow-400 transition-colors p-1"
               >
                 {showHelp ? <Lightbulb className="w-4 h-4 text-yellow-400 fill-current" /> : <Info className="w-4 h-4" />}
               </button>
            </div>

            <AnimatePresence>
              {showHelp && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm p-3 rounded-lg mt-3 text-left">
                    <p>💡 <strong>Pista:</strong> {content.explanation || "Ordena els elements lògicament de dalt a baix."}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. ZONA PRINCIPAL (SCROLL UNIFICAT) */}
          <div className="flex-1 overflow-y-auto px-1 pb-4 scrollbar-hide">
            
            {/* 2.1 ZONA D'ORDENACIÓ (TOWER) */}
            <div className={clsx(
              "rounded-2xl border-2 border-dashed p-4 min-h-[200px] transition-colors relative",
              status === 'error' ? "border-red-500/50 bg-red-500/5" :
              status === 'success' ? "border-emerald-500/50 bg-emerald-500/5" :
              "border-slate-700 bg-slate-900/30"
            )}>
              {/* Etiqueta de fons */}
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                 <ArrowDown className="w-12 h-12 text-slate-500" />
              </div>

              <Reorder.Group axis="y" values={selected} onReorder={setSelected} className="flex flex-col gap-3">
                <AnimatePresence mode='popLayout'>
                  {selected.map((item, index) => (
                    <Reorder.Item 
                      key={item.id} 
                      value={item} 
                      dragListener={status !== 'success'} 
                      layoutId={item.id}
                      className={clsx(
                        "relative p-4 rounded-xl border flex items-center gap-4 select-none touch-none shadow-lg active:scale-105 transition-transform",
                        status === 'success' ? "bg-emerald-900/40 border-emerald-500/50" : "bg-slate-800 border-slate-600"
                      )}
                    >
                      {/* Número d'ordre */}
                      <div className="flex-none w-8 h-8 rounded-full bg-slate-950/50 flex items-center justify-center font-mono font-bold text-slate-400 border border-slate-700">
                        {index + 1}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 font-medium text-slate-200 text-sm md:text-base leading-snug">
                        {item.text}
                      </div>

                      {/* Controls */}
                      {status !== 'success' && (
                        <div className="flex flex-col gap-1 text-slate-500">
                           <button onClick={() => handleDeselect(item)} className="p-1 hover:text-red-400">
                              <X className="w-5 h-5" />
                           </button>
                        </div>
                      )}
                      
                      {/* Drag Handle */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 -ml-3 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-slate-600" />
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>

              {/* EMPTY SLOTS (PLACEHOLDERS) */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={`empty-${i}`}
                  className="mt-3 border-2 border-dashed border-slate-800 rounded-xl h-16 flex items-center justify-center text-slate-700 bg-slate-900/20"
                >
                   <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                     {t('modes.logic_order.placeholder')} {selected.length + i + 1}
                   </span>
                </motion.div>
              ))}
            </div>

            {/* SEPARADOR */}
            <div className="h-8 flex items-center justify-center my-2">
               <div className="h-px bg-slate-800 w-full max-w-[100px]" />
               <span className="px-3 text-[10px] text-slate-500 uppercase font-bold">Opcions Disponibles</span>
               <div className="h-px bg-slate-800 w-full max-w-[100px]" />
            </div>

            {/* 2.2 BANC D'OPCIONS (GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
              <AnimatePresence mode='popLayout'>
                {available.map((item) => (
                  <motion.button
                    layoutId={item.id}
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    disabled={status === 'success'}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-slate-800 border-b-4 border-slate-950 text-slate-300 text-sm font-medium text-left flex justify-between items-center group shadow-md hover:bg-slate-750 hover:border-blue-900 transition-all"
                  >
                    <span className="pr-4">{item.text}</span>
                    <div className="w-6 h-6 rounded-full bg-slate-700 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                      <span className="text-white font-bold text-xs">+</span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
              
              {available.length === 0 && selected.length > 0 && (
                <div className="col-span-full text-center py-8 text-slate-600 animate-pulse">
                   Tot llest! Revisa l'ordre i prem Comprovar.
                </div>
              )}
            </div>

          </div>
        </div>
      </LayoutGroup>
    </GameSessionLayout>
  );
}