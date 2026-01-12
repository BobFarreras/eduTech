// filepath: src/presentation/components/features/learning-path/LevelNode.tsx
'use client';

import Link from 'next/link';
import {
  Check, Lock, Puzzle, Brain,
  ArrowDownUp, SquareTerminal, Wrench
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

// ... funció getGameIcon igual ...
function getGameIcon(type: string) {
    // ... (igual que abans)
    return <Brain className="w-8 h-8" />;
}

export function LevelNode({ 
  tier, status, slug, predominantType = 'QUIZ', isCurrentPosition,
  isBoss, bossTitleKey, bossIconName, bossColorClass 
}: LevelNodeProps) {

  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED'; // 👈 Definim això

  // ============================================
  // 🏰 RENDERITZAT DE BOSS
  // ============================================
  if (isBoss) {
    const BossContent = (
       <div className="relative group flex flex-col items-center justify-center py-4 z-20">
          <BossMarker 
             titleKey={bossTitleKey}
             iconName={bossIconName}
             colorClass={bossColorClass}
             isLocked={isLocked}
             isCompleted={isCompleted} // 👈 Passem la prop nova!
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
  // ... (La resta del fitxer es manté IDÈNTIC a l'anterior) ...
  const baseStyles = "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center border-b-4 transition-all duration-300 z-10 active:border-b-0 active:translate-y-[4px]";
  const statusStyles = {
    LOCKED: "bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed",
    COMPLETED: "bg-emerald-500 border-emerald-700 text-white shadow-lg shadow-emerald-900/20",
    ACTIVE: "bg-blue-600 border-blue-800 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] ring-4 ring-blue-500/20"
  };

  const NormalContent = (
    <div className="relative group">
       {/* ... contingut normal ... */}
       <div className={clsx(baseStyles, statusStyles[status])}>
          <div className={clsx("transition-transform duration-300", status === 'ACTIVE' ? "scale-110" : "group-hover:scale-110", status === 'LOCKED' && "opacity-40 grayscale")}>
             {/* ... icona ... */}
             <Brain className="w-8 h-8" />
          </div>
          {status === 'COMPLETED' && <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 rounded-full p-1 border-4 border-slate-950 shadow-sm z-20"><Check className="w-3.5 h-3.5 stroke-3" /></div>}
          {status === 'LOCKED' && <div className="absolute -right-1 -bottom-1 bg-slate-700 text-slate-400 rounded-full p-1.5 border-4 border-slate-950 z-20"><Lock className="w-3 h-3" /></div>}
       </div>
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