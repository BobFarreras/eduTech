// filepath: src/presentation/components/features/game-engine/code-fix/SolutionDeck.tsx
import { CodeFixOption } from '@/core/entities/challenges/challenge.entity';
import { clsx } from 'clsx';

interface SolutionDeckProps {
  options: CodeFixOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSubmitted: boolean;
}

export function SolutionDeck({ options, selectedId, onSelect, isSubmitted }: SolutionDeckProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {options.map((opt) => {
        const isSelected = selectedId === opt.id;
        
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            disabled={isSubmitted && isSelected} // Bloquegem només si ja hem enviat
            className={clsx(
              "p-4 rounded-xl border-2 font-mono text-sm transition-all duration-200 shadow-lg hover:-translate-y-1",
              isSelected 
                ? "bg-blue-600 border-blue-400 text-white ring-2 ring-blue-400/50" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750"
            )}
          >
            {opt.code}
          </button>
        );
      })}
    </div>
  );
}