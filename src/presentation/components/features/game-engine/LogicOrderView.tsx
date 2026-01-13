// filepath: src/presentation/components/features/game-engine/LogicOrderView.tsx
'use client';

import { Challenge } from '@/core/entities/challenges/index';
// ❌ ELIMINAT: GameSessionLayout i GameHeader (ja els tens al page.tsx)
import { useLogicOrder } from './logic-order/useLogicOrder'; // Importem el hook
import { OrderList } from './logic-order/OrderList';    
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { RotateCcw, Check, X, Info, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface LogicOrderViewProps {
    challenge: Challenge;
    onNext: (isCorrect: boolean) => void;
}

export function LogicOrderView({ challenge, onNext }: LogicOrderViewProps) {
    const t = useTranslations('game');
    const { 
        available, selected, status, content, 
        selectItem, deselectItem, reorderItems, reset, checkResult, 
        isComplete, totalSlots 
    } = useLogicOrder(challenge, onNext);

    const [showHelp, setShowHelp] = useState(false);
    
    // ✅ LÒGICA CLAU: Si queden opcions, mostrem el banc. Si no, mostrem els botons.
    const showOptions = available.length > 0;

    return (
        // 1. LAYOUT RELATIU: S'adapta al contenidor del pare (PlayPage)
        <div className="flex flex-col h-full w-full overflow-hidden relative">
            
            <LayoutGroup>
                {/* --- ZONA A: LLISTA I CONTINGUT (flex-1) --- */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative flex flex-col">
                    
                    {/* Enunciat */}
                    <div className="px-4 py-2 text-center shrink-0">
                        <h2 className="text-sm md:text-base font-bold text-slate-200 leading-snug">
                            {content.description}
                        </h2>
                        
                        {/* Botó Pista */}
                        <div className="flex justify-center mt-1">
                            <button 
                                onClick={() => setShowHelp(!showHelp)} 
                                className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                            >
                                <Info className="w-3 h-3" /> {showHelp ? 'Amagar Pista' : 'Pista'}
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
                                    <div className="bg-blue-900/20 text-blue-200 text-xs p-3 rounded-lg mt-2 border border-blue-800/50 text-left mx-auto max-w-lg">
                                        {content.explanation}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Llista Ordenable */}
                    <div className="px-4 pb-4 flex-1 w-full max-w-2xl mx-auto">
                        <OrderList 
                            items={selected} 
                            status={status} 
                            totalSlots={totalSlots}
                            onReorder={reorderItems} 
                            onRemove={deselectItem} 
                        />
                    </div>
                </div>

                {/* --- ZONA B: INTERCANVIABLE (Shrink-0) --- */}
                {/* Aquest contenidor sempre està a baix, però canvia el contingut */}
                <div className="shrink-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 z-30 transition-all duration-300">
                    <AnimatePresence mode='wait'>
                        
                        {/* OPCIÓ 1: BANC DE FITXES (Mentre juguem) */}
                        {showOptions ? (
                            <motion.div
                                key="options-bank"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="p-4 w-full max-w-2xl mx-auto pb-safe"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Disponibles ({available.length})
                                    </span>
                                    {/* Petit Reset d'emergència aquí dalt */}
                                    <button onClick={reset} className="text-slate-600 hover:text-slate-400" title="Reiniciar">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                                    {available.map((item) => (
                                        <motion.button
                                            layoutId={item.id}
                                            key={item.id}
                                            onClick={() => selectItem(item)}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-left flex justify-between items-center shadow-sm active:bg-slate-700"
                                        >
                                            <span className="text-sm font-medium text-slate-300 line-clamp-1">
                                                {item.text}
                                            </span>
                                            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold border border-slate-600 shrink-0">
                                                +
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            
                            /* OPCIÓ 2: BOTONS D'ACCIÓ (Quan està buit) */
                            /* Això apareix EXACTAMENT al mateix lloc on estaven les opcions */
                            <motion.div
                                key="action-buttons"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 w-full max-w-2xl mx-auto pb-safe"
                            >
                                <div className="flex flex-col items-center mb-4">
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse mb-1">
                                        Seqüència Completa
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-emerald-500/50" />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={reset}
                                        disabled={status === 'success'}
                                        className="p-4 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                    
                                    <button
                                        onClick={checkResult}
                                        disabled={status === 'success'}
                                        className={clsx(
                                            "flex-1 p-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                                            status === 'idle' && "bg-blue-600 text-white shadow-blue-500/20",
                                            status === 'error' && "bg-red-500 text-white animate-shake",
                                            status === 'success' && "bg-emerald-500 text-white"
                                        )}
                                    >
                                        {status === 'checking' ? <span className="animate-spin">⏳</span> :
                                         status === 'success' ? <><Check className="w-6 h-6" /> {t('feedback.correct')}</> :
                                         status === 'error' ? <><X className="w-6 h-6" /> {t('feedback.incorrect')}</> :
                                         <>{t('actions.check')} <Check className="w-5 h-5 opacity-50" /></>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </LayoutGroup>
        </div>
    );
}