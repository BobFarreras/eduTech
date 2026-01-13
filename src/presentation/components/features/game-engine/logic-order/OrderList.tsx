// filepath: src/presentation/components/features/game-engine/components/OrderList.tsx
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { ChallengeOption } from '@/core/entities/challenges/index';
import { X, GripVertical, ArrowDown, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { GameStatus } from './useLogicOrder';

interface OrderListProps {
    items: ChallengeOption[];
    status: GameStatus;
    totalSlots: number;
    onReorder: (items: ChallengeOption[]) => void;
    onRemove: (item: ChallengeOption) => void;
}

export function OrderList({ items, status, totalSlots, onReorder, onRemove }: OrderListProps) {
    const isComplete = items.length === totalSlots;

    return (
        <div className={clsx(
            "rounded-xl border-2 border-dashed p-3 w-full transition-all duration-300 relative flex flex-col gap-2",
            // L'alçada s'adaptarà automàticament al contingut.
            status === 'error' ? "border-red-500/50 bg-red-500/5" :
            status === 'success' ? "border-emerald-500/50 bg-emerald-500/5" :
            "border-slate-700 bg-slate-900/30"
        )}>
            {/* Si no hi ha res, mostrem icona de fons per donar context */}
            {items.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <ArrowDown className="w-12 h-12 text-slate-500 animate-pulse" />
                </div>
            )}

            {/* LLISTA D'ELEMENTS JA COL·LOCATS */}
            <Reorder.Group axis="y" values={items} onReorder={onReorder} className="flex flex-col gap-2 w-full">
                <AnimatePresence mode='popLayout'>
                    {items.map((item, index) => (
                        <Reorder.Item 
                            key={item.id} 
                            value={item} 
                            dragListener={status !== 'success'} 
                            layoutId={item.id}
                            className={clsx(
                                "relative p-3 rounded-lg border flex items-center gap-3 select-none touch-none shadow-md z-10",
                                status === 'success' ? "bg-emerald-900/40 border-emerald-500/50" : "bg-slate-800 border-slate-600"
                            )}
                        >
                            <span className="flex-none w-6 h-6 rounded-full bg-slate-950/50 flex items-center justify-center text-[10px] font-mono text-slate-400 border border-slate-700">
                                {index + 1}
                            </span>
                            <span className="flex-1 font-medium text-slate-200 text-sm leading-tight">
                                {item.text}
                            </span>
                            {status !== 'success' && (
                                <button onClick={() => onRemove(item)} className="p-2 -mr-2 text-slate-500 hover:text-red-400">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 -ml-2 opacity-0 hover:opacity-100 cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 text-slate-600" />
                            </div>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {/* EL "PROPER SLOT" (Només en mostrem 1 si no hem acabat) */}
            {!isComplete && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-12 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/20 flex items-center justify-center shrink-0"
                >
                    <div className="flex items-center gap-2 text-slate-500">
                        <Target className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            Posició {items.length + 1} de {totalSlots}
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}