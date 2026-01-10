'use client';

import { useState } from 'react';
import { Challenge, CodeFixContent } from '@/core/entities/challenges/challenge.entity';
import { Terminal, Play, ArrowRight } from 'lucide-react';
import { CodeWindow } from './code-fix/CodeWindow';
import { SolutionDeck } from './code-fix/SolutionDeck';
import { HintPanel } from './code-fix/HintPanel';
import { clsx } from 'clsx';

interface CodeFixViewProps {
  challenge: Challenge;
  onNext: (isCorrect: boolean) => void;
}

export function CodeFixView({ challenge, onNext }: CodeFixViewProps) {
  const content = challenge.content as CodeFixContent;
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleCheck = () => {
    if (!selectedId) return;

    const selectedOption = content.options.find(opt => opt.id === selectedId);
    
    if (selectedOption?.isCorrect) {
       setStatus('SUCCESS');
       // Donem temps per veure l'animació d'èxit abans de passar
       // No fem onNext automàtic, deixem que l'usuari cliqui "Continuar" o automàtic després de delay
       setTimeout(() => onNext(true), 1500); 
    } else {
       setStatus('ERROR');
       // Reset de l'error després d'un moment
       setTimeout(() => setStatus('IDLE'), 1000);
    }
  };

  const currentCode = selectedId 
    ? content.options.find(o => o.id === selectedId)?.code 
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2 text-slate-300">
         <div className="p-2 bg-blue-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-blue-400" />
         </div>
         <h2 className="font-mono font-bold text-lg text-white">DEBUG_MODE</h2>
      </div>
      
      <p className="text-slate-400 text-sm mb-6 ml-12">
         {content.description}
      </p>

      {/* COMPONENT VISUAL 1: Editor */}
      <CodeWindow 
         initialCode={content.initialCode} 
         selectedCode={currentCode}
         isError={status === 'ERROR'}
         isSuccess={status === 'SUCCESS'}
      />

      {/* COMPONENT VISUAL 2: Cartes */}
      <SolutionDeck 
         options={content.options} 
         selectedId={selectedId} 
         onSelect={(id) => {
             setSelectedId(id);
             setStatus('IDLE');
         }}
         isSubmitted={status === 'SUCCESS'}
      />

      {/* COMPONENT VISUAL 3: Pista */}
      <HintPanel hintText={content.hint} />

      {/* ACCIÓ PRINCIPAL */}
      <div className="mt-8 flex justify-end border-t border-slate-800 pt-6">
         <button
            onClick={handleCheck}
            disabled={!selectedId || status === 'SUCCESS'}
            className={clsx(
               "px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
               !selectedId ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
               status === 'SUCCESS' ? "bg-green-600 text-white hover:scale-105" :
               "bg-blue-600 hover:bg-blue-500 text-white hover:scale-105"
            )}
         >
            {status === 'SUCCESS' ? 'CODI ARREGLAT!' : 'EXECUTAR CODI'} 
            {status === 'SUCCESS' ? <ArrowRight className="w-5 h-5" /> : <Play className="w-4 h-4 fill-current" />}
         </button>
      </div>

    </div>
  );
}