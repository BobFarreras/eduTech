// filepath: src/presentation/components/features/game/code-fix/SmartTerminal.tsx
'use client';

import { FileText, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

interface SmartTerminalProps {
  language: string;
  fileName: string;
  activeTab: 'CODE' | 'MISSION' | 'HINT';
  onTabChange: (tab: 'CODE' | 'MISSION' | 'HINT') => void;
}

export function SmartTerminal({ 
  language, 
  fileName, 
  activeTab,
  onTabChange 
}: SmartTerminalProps) {

  return (
    <div className="bg-[#252526] flex items-center border-b border-[#333] select-none overflow-x-auto no-scrollbar">
      
      {/* 1. TAB: EDITOR (Fitxer) */}
      <button
        onClick={() => onTabChange('CODE')}
        className={clsx(
           "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-r border-[#333] transition-colors min-w-fit",
           activeTab === 'CODE' 
             ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-blue-500" 
             : "bg-[#2d2d2d] text-slate-500 hover:bg-[#2a2a2a] hover:text-slate-400 border-t-2 border-t-transparent"
        )}
      >
         {/* Icona de llenguatge (TS/JS/PY) */}
         <span className={clsx(
             "font-bold text-[10px]",
             language === 'typescript' ? "text-blue-400" : "text-yellow-400"
         )}>
             {language === 'typescript' ? 'TS' : 'JS'}
         </span>
         <span>{fileName}</span>
      </button>

      {/* 2. TAB: MISSION (Instruccions) */}
      <button
        onClick={() => onTabChange('MISSION')}
        className={clsx(
           "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-r border-[#333] transition-colors min-w-fit",
           activeTab === 'MISSION' 
             ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-purple-500" 
             : "bg-[#2d2d2d] text-slate-500 hover:bg-[#2a2a2a] hover:text-slate-400 border-t-2 border-t-transparent"
        )}
      >
         <FileText className="w-3.5 h-3.5" />
         <span>Brief</span>
      </button>

      {/* 3. TAB: HINT (Pista) */}
      <button
        onClick={() => onTabChange('HINT')}
        className={clsx(
           "flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-r border-[#333] transition-colors min-w-fit",
           activeTab === 'HINT' 
             ? "bg-[#1e1e1e] text-yellow-400 border-t-2 border-t-yellow-500" 
             : "bg-[#2d2d2d] text-slate-500 hover:bg-[#2a2a2a] hover:text-slate-400 border-t-2 border-t-transparent"
        )}
      >
         <Lightbulb className="w-3.5 h-3.5" />
         <span>Hint</span>
      </button>

      {/* Espai buit restant (Estètica IDE) */}
      <div className="flex-1 bg-[#252526] h-full" />
      
      {/* Botons de finestra (Decoració Mac) */}
      <div className="hidden xs:flex gap-1.5 px-3 opacity-50">
         <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
         <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
         <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      </div>

    </div>
  );
}