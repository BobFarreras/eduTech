// filepath: src/presentation/components/features/game-engine/TerminalView.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Challenge, TerminalContent } from '@/core/entities/challenges/index';
import { Terminal as TerminalIcon, ArrowRight, CheckCircle2, Command } from 'lucide-react';
import { HintPanel } from './code-fix/HintPanel';
import { GameSessionLayout } from './layout/GameSessionLayout';
import { GameHeader } from './layout/GameHeader'; // ✅ Importem el Header intel·ligent
import { useTranslations } from 'next-intl';

interface TerminalViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
  // ❌ sessionData ELIMINAT
}

type LogLine = {
  type: 'command' | 'output-success' | 'output-error';
  text: string;
};

export function TerminalView({ challenge, onNext }: TerminalViewProps) {
  const t = useTranslations('game');
  const content = challenge.content as TerminalContent;
  
  const [input, setInput] = useState(content.initialCommand || '');
  const [history, setHistory] = useState<LogLine[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll i Focus logic (igual que abans)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (!isCompleted) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [history, isCompleted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCompleted && input.trim()) {
      executeCommand();
    }
  };

  const executeCommand = () => {
    const cmd = input.trim();
    const newHistory: LogLine[] = [...history, { type: 'command', text: cmd }];

    const normalizedInput = cmd.replace(/\s+/g, ' ').trim();
    const isValid = content.validCommands.some(vc => vc.replace(/\s+/g, ' ').trim() === normalizedInput);

    if (isValid) {
      newHistory.push({ type: 'output-success', text: content.outputParams.success });
      setHistory(newHistory);
      setIsCompleted(true);
      setInput('');
    } else {
      newHistory.push({ type: 'output-error', text: `${cmd}: ${content.outputParams.error}` });
      setHistory(newHistory);
      setInput('');
    }
  };

  // --- FOOTER (Específic d'aquest joc) ---
  const Footer = isCompleted ? (
    <div className="animate-in slide-in-from-bottom-4 duration-500 w-full">
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-green-400 font-bold text-sm">{t('feedback.correct')}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {content.explanation}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => onNext(true)}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
                {t('actions.continue')} <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    </div>
  ) : (
    content.hint ? <div className="w-full"><HintPanel hintText={content.hint} /></div> : <div className="h-4" />
  );

  return (
    // ✅ HEADER AUTOMÀTIC: Només el cridem, no li passem res
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      <div className="flex flex-col h-full gap-2">
        
        {/* TITOL (Fixe) */}
        <div className="shrink-0 flex items-start gap-3 px-1 pb-2">
           <div className="p-2 bg-slate-800 rounded-lg shrink-0 border border-slate-700 shadow-sm">
              <TerminalIcon className="w-5 h-5 text-green-400" />
           </div>
           <div className="min-w-0">
              <h2 className="font-bold text-white text-base leading-tight truncate">{t('modes.terminal.label')}</h2>
              <p className="text-slate-400 text-xs leading-snug mt-0.5 line-clamp-2">{content.instruction}</p>
           </div>
        </div>

        {/* TERMINAL UI */}
        <div 
          className="flex-1 min-h-0 bg-[#0c0c0c] rounded-xl overflow-hidden border border-slate-700 shadow-2xl font-mono text-sm relative flex flex-col"
          onClick={() => !isCompleted && inputRef.current?.focus()}
        >
          {/* Top Bar Decoration */}
          <div className="bg-[#1f1f1f] px-3 py-1.5 flex items-center gap-2 border-b border-[#333] shrink-0">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-slate-500 text-[10px] ml-2 flex items-center gap-1 opacity-60">
               <Command className="w-3 h-3" /> {t('modes.terminal.prompt_user')}@edutech:~
            </div>
          </div>

          {/* Logs Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent space-y-1"
          >
            {history.map((line, i) => (
              <div key={i} className="wrap-break-word leading-relaxed text-xs md:text-sm">
                {line.type === 'command' && (
                  <div className="text-white mt-2">
                    <span className="text-green-500 mr-2 font-bold">➜</span>
                    <span className="text-blue-400 mr-2 font-bold">~</span>
                    {line.text}
                  </div>
                )}
                {line.type === 'output-success' && (
                  <div className="text-emerald-400/90 whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30 ml-1 mt-1 font-medium pb-2">
                    {line.text}
                  </div>
                )}
                {line.type === 'output-error' && (
                  <div className="text-red-400 pl-4 mt-1 bg-red-500/5 p-1 rounded-sm inline-block">
                    {line.text}
                  </div>
                )}
              </div>
            ))}

            {/* Input Actiu */}
            {!isCompleted && (
              <div className="flex items-center text-white animate-in fade-in pt-1 pb-10">
                <span className="text-green-500 mr-2 shrink-0 font-bold">➜</span>
                <span className="text-blue-400 mr-2 shrink-0 font-bold">~</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('modes.terminal.placeholder')}
                  className="bg-transparent border-none outline-none flex-1 text-white placeholder-slate-700 font-mono caret-green-500 p-0 m-0"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </div>
            )}
            
            {isCompleted && (
               <div className="mt-4 text-slate-500 italic text-xs border-t border-slate-800 pt-2">
                  {t('modes.terminal.session_closed')}
               </div>
            )}
          </div>
        </div>

      </div>
    </GameSessionLayout>
  );
}