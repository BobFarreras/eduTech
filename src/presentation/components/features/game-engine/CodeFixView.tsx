// filepath: src/presentation/components/features/game/code-fix/CodeFixView.tsx
'use client';

import { useState } from 'react';
import { Challenge, CodeFixContent } from '@/core/entities/challenges';
import { SmartTerminal } from './code-fix/SmartTerminal'; 
import { CodeWindow } from './code-fix/CodeWindow';
import { SolutionDeck } from './code-fix/SolutionDeck';
import { GameSessionLayout } from '@/presentation/components/features/game-engine/layout/GameSessionLayout';
import { GameHeader } from '@/presentation/components/features/game-engine/layout/GameHeader';
import { useTranslations } from 'next-intl';
import { Play, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface CodeFixViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function CodeFixView({ challenge, onNext }: CodeFixViewProps) {
  const t = useTranslations('game');
  const content = challenge.content as CodeFixContent;
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  // NOU ESTAT: Quina pestanya estem veient a la terminal? ('CODE', 'MISSION', 'HINT')
  const [activeTab, setActiveTab] = useState<'CODE' | 'MISSION' | 'HINT'>('CODE');

  const handleRun = async () => {
    if (!selectedId) return;
    setStatus('RUNNING');
    // Forcem veure el codi quan s'executa per veure l'efecte visual
    setActiveTab('CODE');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const selectedOption = content.options.find(opt => opt.id === selectedId);
    if (selectedOption?.isCorrect) {
       setStatus('SUCCESS');
    } else {
       setStatus('ERROR');
       setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  const currentCode = selectedId 
    ? content.options.find(o => o.id === selectedId)?.code 
    : null;

  // --- FOOTER (Botó d'acció) ---
  const Footer = (
    <div className="w-full px-4 py-3 md:pb-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
        {status === 'SUCCESS' ? (
            <button
                onClick={() => onNext(true)}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95 transition-all"
            >
                {t('arena.continue_btn')} <ArrowRight className="w-5 h-5" />
            </button>
        ) : (
            <button
                onClick={handleRun}
                disabled={!selectedId || status === 'RUNNING'}
                className={clsx(
                    "w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95",
                    !selectedId 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : status === 'ERROR'
                        ? "bg-red-600 text-white animate-shake"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                )}
            >
                {status === 'RUNNING' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                <span className="uppercase tracking-wide text-xs md:text-sm ml-2">
                    {status === 'RUNNING' ? t('loading') : status === 'ERROR' ? t('feedback.incorrect') : t('actions.verify')}
                </span>
            </button>
        )}
    </div>
  );

  return (
    <GameSessionLayout header={<GameHeader />} footer={Footer}>
      
      {/* CONTENIDOR PRINCIPAL (Flex column per ocupar alçada i ajustar-se) */}
      <div className="flex flex-col w-full h-full gap-4">
        
        {/* 1. SMART TERMINAL INTEGRADA (Tabs + Contingut) */}
        <div className="w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col bg-[#1e1e1e]">
            
            {/* Header amb Pestanyes estil VSCode */}
            <SmartTerminal 
               language="typescript" // Això podria venir del topic
               fileName="Solution.tsx"
               activeTab={activeTab}
               onTabChange={setActiveTab}
            />

            {/* Contingut Canviant segons la pestanya */}
            <div className="relative min-h-50">
                
                {/* VISTA 1: EDITOR DE CODI (Per defecte) */}
                <div className={clsx("transition-opacity duration-300", activeTab === 'CODE' ? "block" : "hidden")}>
                    <CodeWindow 
                       initialCode={content.initialCode}
                       selectedCode={currentCode}
                       status={status}
                    />
                </div>

                {/* VISTA 2: INSTRUCCIONS (MISSION) */}
                {activeTab === 'MISSION' && (
                    <div className="p-6 text-slate-300 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
                        <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 border-b border-slate-700 pb-2">
                            Mission Briefing
                        </h3>
                        {content.description}
                    </div>
                )}

                {/* VISTA 3: PISTA (HINT) */}
                {activeTab === 'HINT' && (
                    <div className="p-6 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                            <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                                Developer Hint
                            </h3>
                            <p className="text-yellow-100/80 text-sm italic">
                                {content.hint}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* 2. OPCIONS (Sempre visibles a sota, scrollable si cal) */}
        <div className="flex-1 pb-4">
           <div className="flex justify-between items-end mb-2 px-1">
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Available Patches
              </h3>
           </div>

           <SolutionDeck 
              options={content.options} 
              selectedId={selectedId} 
              onSelect={(id) => { 
                 if (status !== 'SUCCESS') { 
                    setSelectedId(id); 
                    setStatus('IDLE'); 
                    // Opcional: Si cliques una opció, et tornem al codi automàticament
                    setActiveTab('CODE');
                 } 
              }} 
              isSubmitted={status === 'SUCCESS'} 
           />
        </div>

      </div>
    </GameSessionLayout>
  );
}