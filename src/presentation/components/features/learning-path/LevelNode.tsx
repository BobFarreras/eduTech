// filepath: src/presentation/components/features/learning-path/LevelNode.tsx
'use client';

import Link from 'next/link';
import {
  Check, Lock, Puzzle, Brain,
  ArrowDownUp, SquareTerminal, Wrench, BookOpen,
  Scale // He afegit Scale per al tipus BINARY_DECISION
} from 'lucide-react';
import { clsx } from 'clsx';
import { LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { BossMarker } from './BossMarker';

interface LevelNodeProps {
  tier: number;
  status: LevelStatus;
  slug: string;
  index: number;
  predominantType?: ChallengeType;
  isCurrentPosition?: boolean;
  isBoss?: boolean;
  bossTitleKey?: string;
  bossIconName?: string;
  bossColorClass?: string;
}

// 🛠️ FIX: Recuperem la lògica de selecció d'icona
function getGameIcon(type: string) {
  switch (type) {
    case 'THEORY': // 2. Nou tipus: TEORIA
      return <BookOpen className="w-8 h-8" />;
    case 'TERMINAL':
      return <SquareTerminal className="w-8 h-8" />;
    case 'CODE_FIX':
      return <Wrench className="w-8 h-8" />;
    case 'MATCHING':
      return <Puzzle className="w-8 h-8" />;
    case 'BINARY_DECISION':
      return <Scale className="w-8 h-8" />; // Icona de balança per decisions
    case 'LOGIC_ORDER': // Si tens aquest tipus en el futur
      return <ArrowDownUp className="w-8 h-8" />;
    case 'QUIZ':
    default:
      return <Brain className="w-8 h-8" />;
  }
}

export function LevelNode({
  tier, status, slug, predominantType = 'QUIZ', isCurrentPosition,
  isBoss, bossTitleKey, bossIconName, bossColorClass
}: LevelNodeProps) {

  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED';
  // Si és un node de TEORIA, li donem un estil especial (Lila)
  const isTheory = predominantType === 'THEORY';
  // ============================================
  // 🏰 RENDERITZAT DE BOSS (Delegate Pattern)
  // ============================================
  if (isBoss) {
    const BossContent = (
      <div className="relative group flex flex-col items-center justify-center py-4 z-20">
        <BossMarker
          titleKey={bossTitleKey}
          iconName={bossIconName}
          colorClass={bossColorClass}
          isLocked={isLocked}
          isCompleted={isCompleted}
        />
      </div>
    );

    return isLocked ? (
      <div className="flex justify-center">{BossContent}</div>
    ) : (
      <div className="flex justify-center">
        <Link href={`/learn/${slug}/play?tier=${tier}`}>{BossContent}</Link>
      </div>
    );
  }

  // ============================================
  // 🟢 RENDERITZAT NORMAL
  // ============================================

  const baseStyles = "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border-b-4 transition-all duration-300 z-10 active:border-b-0 active:translate-y-[4px]";

  const statusStyles = {
    LOCKED: "bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed",
    COMPLETED: "bg-emerald-500 border-emerald-700 text-white shadow-lg shadow-emerald-900/20",
    // 3. Si és TEORIA actiu, el fem Lila. Si és JOC actiu, Blau.
    ACTIVE: isTheory
      ? "bg-purple-600 border-purple-800 text-white shadow-[0_0_40px_rgba(147,51,234,0.4)] ring-4 ring-purple-500/20"
      : "bg-blue-600 border-blue-800 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] ring-4 ring-blue-500/20"
  };

  const NormalContent = (
    <div className="relative group">
      {/* Fletxa de START només si és la posició actual */}
      {isCurrentPosition && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-30 pointer-events-none">
          <div className="bg-white text-blue-600 px-3 py-1 rounded-lg font-bold text-[10px] shadow-xl mb-0.5 uppercase tracking-wider border-2 border-blue-100">START</div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-white"></div>
        </div>
      )}

      <div className={clsx(baseStyles, statusStyles[status])}>
        <div className={clsx("transition-transform duration-300", status === 'ACTIVE' ? "scale-110" : "group-hover:scale-110", status === 'LOCKED' && "opacity-40 grayscale")}>
          {/* AQUÍ ÉS ON CRIDEM LA FUNCIÓ ARREGLADA */}
          {getGameIcon(predominantType)}
        </div>

        {/* Badges petits de estat */}
        {status === 'COMPLETED' && <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 rounded-full p-1 border-4 border-slate-950 shadow-sm z-20"><Check className="w-3.5 h-3.5 stroke-3" /></div>}
        {status === 'LOCKED' && <div className="absolute -right-1 -bottom-1 bg-slate-700 text-slate-400 rounded-full p-1.5 border-4 border-slate-950 z-20"><Lock className="w-3 h-3" /></div>}
      </div>

      {/* Etiqueta de nivell */}
      <div className={clsx("absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[10px] font-bold whitespace-nowrap shadow-md", status === 'ACTIVE' ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-900 border-slate-700 text-slate-400")}>
        LVL {tier}
      </div>
    </div>
  );

  return isLocked ? (
    <div className="flex justify-center py-4">{NormalContent}</div>
  ) : (
    <div className="flex justify-center py-4">
      <Link href={`/learn/${slug}/play?tier=${tier}`}>{NormalContent}</Link>
    </div>
  );
}