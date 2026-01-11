// filepath: src/presentation/components/features/game/code-fix/SolutionDeck.tsx
'use client';

import { CodeFixOption } from '@/core/entities/challenges';
import { clsx } from 'clsx';
import { CheckCircle2, Circle } from 'lucide-react';

interface SolutionDeckProps {
  options: CodeFixOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isSubmitted: boolean;
}

export function SolutionDeck({ options, selectedId, onSelect, isSubmitted }: SolutionDeckProps) {
  return (
    // Grid: 1 columna en mòbil, 2 en tablet+
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;

        return (
          <button
            key={option.id}
            onClick={() => !isSubmitted && onSelect(option.id)}
            disabled={isSubmitted}
            className={clsx(
              "relative group text-left p-3 rounded-lg border-2 transition-all duration-200 w-full active:scale-[0.98]",
              "min-h-15 flex items-center",
              isSelected
                ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "border-slate-800 bg-[#1e1e1e] hover:border-slate-600",
              isSubmitted && isSelected && "border-green-500 bg-green-500/10"
            )}
          >
            {/* Checkbox */}
            <div className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2",
                isSelected ? "text-blue-400" : "text-slate-700"
            )}>
                {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </div>

            {/* Code Snippet */}
            <div className="pr-8 w-full"> 
                <code className={clsx(
                    "block font-mono text-[11px] md:text-xs leading-tight text-slate-300",
                    // Assegurem que el codi trenqui línies si és molt llarg
                    "break-all whitespace-pre-wrap" 
                )}>
                    {option.code}
                </code>
            </div>
          </button>
        );
      })}
    </div>
  );
}