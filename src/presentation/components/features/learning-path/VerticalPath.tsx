// filepath: src/presentation/components/features/learning-path/VerticalPath.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';

interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}

export function VerticalPath({ levels, slug }: PathProps) {
  // CONFIGURACIÓ MÒBIL
  const AMPLITUDE = 75; 
  const VERTICAL_GAP = 88; 
  const INITIAL_Y = 40;

  return (
      <div className="relative mt-8 w-full flex flex-col items-center">
         
         {/* SVG MÒBIL */}
         <svg className="absolute top-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 0 }}>
            <path 
              d={`M 50% ${INITIAL_Y} ${levels.map((_, i) => {
                 const xOffset = Math.sin(i) * AMPLITUDE; 
                 return `L calc(50% + ${xOffset}px) ${i * VERTICAL_GAP + INITIAL_Y}`;
              }).join(' ')}`}
              fill="none" 
              stroke="#475569" 
              strokeWidth="6" 
              strokeDasharray="8,8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
         </svg>

         {/* NODES MÒBIL */}
         <div className="flex flex-col gap-6 w-full relative z-10 items-center">
             {levels.map((level, index) => {
                 const xOffset = Math.sin(index) * AMPLITUDE; 
                 return (
                    <div 
                      key={level.tier} 
                      style={{ transform: `translateX(${xOffset}px)` }}
                      className="transition-transform duration-500"
                    >
                       <LevelNode 
                          {...level}
                          slug={slug}
                          index={index}
                       />
                    </div>
                 );
             })}
             
             <div className="flex justify-center mt-8 opacity-40">
                 <div className="w-24 h-24 border-4 border-dashed border-slate-700 rounded-full flex items-center justify-center text-slate-600 font-black text-sm bg-slate-900/50">
                    BOSS
                 </div>
             </div>
         </div>
      </div>
  );
}