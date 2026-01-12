// filepath: src/presentation/components/admin/challenges/preview/live-preview.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { ChallengeFormValues, Lang } from '../form/form-config';

// Importem TOTS els components de targetes
import { BinaryCardPreview } from './cards/binary-card';
import { CodeFixCardPreview } from './cards/code-fix-card';
import { QuizCardPreview } from './cards/quiz-card';
import { CtfCardPreview } from './cards/ctf-card';
import { TheoryCardPreview } from './cards/theory-card';
import { MatchingCardPreview } from './cards/matching-card'; // 👈 NOU
import { TerminalCardPreview } from './cards/terminal-card'; // 👈 NOU
import { LogicOrderCardPreview } from './cards/logic-order-card'; // 👈 NOU

// Definim interfícies per al casting segur (Unió de tots els tipus possibles)
// Definim interfícies per al casting segur (Unió de tots els tipus possibles)
export interface PreviewContent {
  // --- BINARY DECISION ---
  statement?: Record<string, string>;
  variant?: 'TRUE_FALSE' | 'HOT_OR_NOT';
  explanation?: Record<string, string>;

  // --- CODE FIX / CTF ---
  description?: Record<string, string>;
  initialCode?: string;
  flag?: string;
  hint?: Record<string, string>;

  // --- QUIZ ---
  question?: Record<string, string>;
  options?: Array<{ 
    id: string; 
    text: Record<string, string> 
  }>;

  // --- THEORY ---
  title?: Record<string, string>;
  markdownContent?: Record<string, string>;
  timeToRead?: number;

  // --- MATCHING (Fix 'any') ---
  instruction?: Record<string, string>;
  pairs?: Array<{
    left: { id: string; text: Record<string, string> };
    right: { id: string; text: Record<string, string> };
  }>;

  // --- TERMINAL (Fix 'any') ---
  initialCommand?: string;
  outputParams?: {
    success: string;
    error: string;
  };
  validCommands?: string[];

  // --- LOGIC ORDER (Fix 'any') ---
  items?: Array<{
    id: string;
    text: Record<string, string>;
  }>;
}

interface Props {
  activeLang: Lang;
}

export function LivePreview({ activeLang }: Props) {
  const { watch } = useFormContext<ChallengeFormValues>();
  
  // Watch optimitzat
  const [type, content, difficulty] = watch(['type', 'content', 'difficultyTier']);

  // Casting segur: Tractem el contingut com una unió de tots els possibles camps
  const safeContent = content as unknown as PreviewContent;

  const getHeaderTitle = () => {
    switch (type) {
      case 'CODE_FIX': return 'BUG HUNTER';
      case 'QUIZ': return 'KNOWLEDGE CHECK';
      case 'CTF': return 'HACKER MODE';
      case 'THEORY': return 'LEARNING';
      case 'MATCHING': return 'CONNECT';
      case 'TERMINAL': return 'TERMINAL';
      case 'LOGIC_ORDER': return 'SEQUENCE';
      default: return 'CHALLENGE';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-black/50 border-l border-gray-200 dark:border-slate-800">
      
      {/* --- DEVICE FRAME (IPHONE) --- */}
      <div className="relative w-full max-w-[360px] h-[640px] bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border-8 border-gray-900 dark:border-gray-800 overflow-hidden flex flex-col">
        
        {/* NOTCH */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-gray-800 rounded-b-xl z-20"></div>
        
        {/* STATUS BAR */}
        <div className="h-12 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 pt-2 shrink-0">
           <span className="text-[10px] font-mono text-gray-400">9:41</span>
           <span className="text-[10px] font-mono text-gray-400">100%</span>
        </div>

        {/* --- SCREEN CONTENT (SCROLLABLE) --- */}
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-slate-900">
            
            {/* APP HEADER (Excepte per teoria que té header propi) */}
            {type !== 'THEORY' && (
              <div className="p-4 flex justify-between items-center z-10 sticky top-0 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-sm">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{getHeaderTitle()}</span>
                   <div className="flex gap-1 mt-1">
                     {[1,2,3,4,5].map(i => (
                       <div key={i} className={`h-1 w-4 rounded-full ${i <= (difficulty || 1) ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-slate-800'}`}></div>
                     ))}
                   </div>
                 </div>
                 <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">XP +{(difficulty || 1) * 10}</span>
              </div>
            )}

            {/* CONTENT AREA */}
            <div className={`flex-1 ${type !== 'THEORY' ? 'p-4 pb-20' : ''}`}>
                {/* RENDERITZACIÓ CONDICIONAL PER A TOTS ELS TIPUS */}
                {type === 'BINARY_DECISION' && <BinaryCardPreview content={safeContent} lang={activeLang} />}
                {type === 'CODE_FIX' && <CodeFixCardPreview content={safeContent} lang={activeLang} />}
                {type === 'QUIZ' && <QuizCardPreview content={safeContent} lang={activeLang} />}
                {type === 'CTF' && <CtfCardPreview content={safeContent} lang={activeLang} />}
                {type === 'THEORY' && <TheoryCardPreview content={safeContent} lang={activeLang} />}
                {type === 'MATCHING' && <MatchingCardPreview content={safeContent} lang={activeLang} />}
                {type === 'TERMINAL' && <TerminalCardPreview content={safeContent} lang={activeLang} />}
                {type === 'LOGIC_ORDER' && <LogicOrderCardPreview content={safeContent} lang={activeLang} />}

                {/* Fallback per si ens deixem algun tipus futur */}
                {!['BINARY_DECISION', 'CODE_FIX', 'QUIZ', 'CTF', 'THEORY', 'MATCHING', 'TERMINAL', 'LOGIC_ORDER'].includes(type) && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 opacity-50 p-8">
                    <span className="text-4xl mb-4">🚧</span>
                    <p className="text-xs uppercase font-mono">Preview not available for<br/>{type}</p>
                  </div>
                )}
            </div>

            {/* ACTION BUTTON (Excepte per teoria) */}
            {type !== 'THEORY' && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pt-10">
                 <button className="w-full py-3.5 bg-black dark:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg transform active:scale-95 transition-all">
                   {type === 'TERMINAL' ? 'EXECUTE' : 'CHECK ANSWER'}
                 </button>
              </div>
            )}
        </div>

        {/* HOME INDICATOR */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full z-20"></div>
      </div>
    </div>
  );
}