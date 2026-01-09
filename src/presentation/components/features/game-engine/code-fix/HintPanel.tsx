// filepath: src/presentation/components/features/game-engine/code-fix/HintPanel.tsx
import { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';


interface HintPanelProps {
  hintText: string;
}

export function HintPanel({ hintText }: HintPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs text-yellow-500/80 hover:text-yellow-400 transition-colors mt-2 ml-auto"
      >
        <Lightbulb className="w-4 h-4" /> Necessito una pista
      </button>
    );
  }

  return (
    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
       <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
       <p className="text-yellow-200/90 text-sm flex-1">{hintText}</p>
       <button onClick={() => setIsOpen(false)} className="text-yellow-500/50 hover:text-yellow-500">
         <X className="w-4 h-4" />
       </button>
    </div>
  );
}