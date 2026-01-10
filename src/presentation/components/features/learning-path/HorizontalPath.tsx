// filepath: src/presentation/components/features/learning-path/HorizontalPath.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';
import { useRef, useEffect } from 'react';

interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}

export function HorizontalPath({ levels, slug }: PathProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll fins al nivell actual quan carregui la pàgina
  useEffect(() => {
    if (containerRef.current) {
        const activeNode = containerRef.current.querySelector('[data-active="true"]');
        if (activeNode) {
            activeNode.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        }
    }
  }, []);

  // CONFIGURACIÓ ESCRIPTORI
  const AMPLITUDE_Y = 60; // Quant puja i baixa la corba
  const HORIZONTAL_GAP = 160; // Espai entre nodes
  const INITIAL_X = 100;

  // Amplada total necessària per al SVG
  const totalWidth = (levels.length * HORIZONTAL_GAP) + 300;

  return (
    <div 
        ref={containerRef}
        className="w-full h-[80vh] overflow-x-auto overflow-y-hidden relative custom-scrollbar flex items-center"
        style={{ scrollBehavior: 'smooth' }}
    >
        <div className="relative h-full flex items-center" style={{ minWidth: `${totalWidth}px` }}>
            
            {/* SVG HORITZONTAL (Ona sinusoïdal lateral) */}
            <svg className="absolute left-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                <path 
                d={`M ${INITIAL_X} 50% ${levels.map((_, i) => {
                    const yOffset = Math.sin(i) * AMPLITUDE_Y; 
                    // Aquí la lògica és inversa: Avancem en X, oscil·lem en Y
                    return `L ${INITIAL_X + (i * HORIZONTAL_GAP)}px calc(50% + ${yOffset}px)`;
                }).join(' ')}`}
                fill="none" 
                stroke="#64748b" 
                strokeWidth="4" 
                strokeDasharray="12,12"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>

            {/* NODES HORITZONTALS */}
            {levels.map((level, index) => {
                const yOffset = Math.sin(index) * AMPLITUDE_Y;
                const leftPos = INITIAL_X + (index * HORIZONTAL_GAP);

                return (
                    <div 
                        key={level.tier}
                        data-active={level.isCurrentPosition}
                        className="absolute transition-all duration-500 hover:z-50"
                        style={{ 
                            left: `${leftPos}px`,
                            // Centrem verticalment (50%) i apliquem l'oscil·lació
                            top: `calc(50% + ${yOffset}px - 48px)` // -48px és la meitat de l'alçada del node (96px/2) per centrar-lo
                        }}
                    >
                        <LevelNode 
                            {...level}
                            slug={slug}
                            index={index}
                        />
                    </div>
                );
            })}

            {/* BOSS FINAL */}
             <div 
                className="absolute opacity-40"
                style={{ 
                    left: `${INITIAL_X + (levels.length * HORIZONTAL_GAP)}px`,
                    top: `calc(50% - 64px)` 
                }}
             >
                 <div className="w-32 h-32 border-4 border-dashed border-slate-700 rounded-full flex items-center justify-center text-slate-500 font-black text-xl bg-slate-900/50">
                    BOSS
                 </div>
             </div>

        </div>
    </div>
  );
}