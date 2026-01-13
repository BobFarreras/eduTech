// filepath: src/presentation/components/features/game-engine/hooks/useLogicOrder.ts
import { useState, useEffect } from 'react';
import { Challenge, LogicOrderContent, ChallengeOption } from '@/core/entities/challenges/index';

export type GameStatus = 'idle' | 'checking' | 'success' | 'error';

export function useLogicOrder(challenge: Challenge, onNext: (success: boolean) => void) {
    const content = challenge.content as LogicOrderContent;
    
    // State
    const [available, setAvailable] = useState<ChallengeOption[]>(content.items);
    const [selected, setSelected] = useState<ChallengeOption[]>([]);
    const [status, setStatus] = useState<GameStatus>('idle');

    // Inicialització (barrejar opcions si cal)
    useEffect(() => {
        // Opcional: barrejar aquí si no ve del backend
    }, []);

    // Actions
    const selectItem = (item: ChallengeOption) => {
        if (status === 'success') return;
        setStatus('idle');
        setAvailable(prev => prev.filter(i => i.id !== item.id));
        setSelected(prev => [...prev, item]);
    };

    const deselectItem = (item: ChallengeOption) => {
        if (status === 'success') return;
        setStatus('idle');
        setSelected(prev => prev.filter(i => i.id !== item.id));
        setAvailable(prev => [...prev, item]);
    };

    const reorderItems = (newOrder: ChallengeOption[]) => {
        if (status === 'success') return;
        setSelected(newOrder);
    };

    const reset = () => {
        setAvailable(content.items);
        setSelected([]);
        setStatus('idle');
    };

    const checkResult = () => {
        if (status === 'success') return;
        setStatus('checking');

        const currentIds = selected.map(s => s.id);
        // Assumim que l'ordre correcte és com ve a 'items' originalment (o ordenat per ID)
        const correctIds = content.items.map(i => i.id); 

        const isCorrect = JSON.stringify(currentIds) === JSON.stringify(correctIds);

        if (isCorrect) {
            setStatus('success');
            setTimeout(() => onNext(true), 1500);
        } else {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 1000);
        }
    };

    return {
        // State
        available,
        selected,
        status,
        content,
        // Computed
        isComplete: selected.length === content.items.length,
        totalSlots: content.items.length,
        // Methods
        selectItem,
        deselectItem,
        reorderItems,
        reset,
        checkResult
    };
}