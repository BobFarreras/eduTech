// filepath: src/presentation/components/features/learning-path/VerticalPath.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';

import { clsx } from 'clsx';

interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}

export function VerticalPath({ levels, slug }: PathProps) {
  const AMPLITUDE = 75; 
  const VERTICAL_GAP = 100; 
  const INITIAL_Y = 60;

  return (
      <div className="relative mt-8 w-full flex flex-col items-center pb-24">
         {/* SVG i Path logic (Igual) */}
         
         <div className="flex flex-col gap-0 w-full relative z-10 items-center">
             {levels.map((level, index) => {
                 const xOffset = Math.sin(index) * AMPLITUDE; 
                 // Més espai vertical si és Boss perquè el Marker ocupa espai
                 const isBossSpacing = level.isBoss ? 'py-8' : 'py-0'; 

                 return (
                    <div 
                      key={level.tier} 
                      className={clsx(
                        "absolute w-full flex justify-center transition-transform duration-500",
                        isBossSpacing
                      )}
                      style={{ 
                          top: `${index * VERTICAL_GAP + INITIAL_Y - 32}px`,
                          transform: `translateX(${xOffset}px)`
                      }}
                    >
                        <div className="relative">
                            
                      

                            <LevelNode {...level} slug={slug} index={index} />
                        </div>
                    </div>
                 );
             })}
         </div>

         <div style={{ height: `${levels.length * VERTICAL_GAP + 100}px` }} />
      </div>
  );
}