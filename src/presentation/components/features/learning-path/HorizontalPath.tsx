// filepath: src/presentation/components/features/learning-path/HorizontalPath.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';
import { useRef, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}


export function HorizontalPath({ levels, slug }: PathProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // --- LOGICA DE SCROLL (Igual que tenies) ---
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const activeNode = container.querySelector('[data-active="true"]');
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'auto', inline: 'center' });
      }
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [levels]);

  const AMPLITUDE_Y = 60;
  const HORIZONTAL_GAP = 160;
  const INITIAL_X = 100;
  const totalWidth = (levels.length * HORIZONTAL_GAP) + 200;

  return (
    <div className="relative w-full h-[80vh] group">

      {/* --- BOTONS DE NAVEGACIÓ (Codi existent) --- */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-24 z-20 flex items-center justify-start pl-4 transition-opacity duration-300 pointer-events-none bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent", showLeft ? "opacity-100" : "opacity-0")}>
        <button onClick={() => scrollBy(-300)} className="bg-slate-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition-all active:scale-90 pointer-events-auto">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className={clsx("absolute right-0 top-0 bottom-0 w-24 z-20 flex items-center justify-end pr-4 transition-opacity duration-300 pointer-events-none bg-linear-to-l from-slate-950 via-slate-950/60 to-transparent", showRight ? "opacity-100" : "opacity-0")}>
        <button onClick={() => scrollBy(300)} className="bg-slate-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition-all active:scale-90 pointer-events-auto">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* --- SCROLL AREA --- */}
      <div ref={scrollRef} className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="relative h-full flex items-center" style={{ minWidth: `${totalWidth}px` }}>

          {/* SVG LINE */}
          <svg className="absolute left-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
            <path
              d={`M ${INITIAL_X} 50% ${levels.map((_, i) => {
                const yOffset = Math.sin(i) * AMPLITUDE_Y;
                return `L ${INITIAL_X + (i * HORIZONTAL_GAP)}px calc(50% + ${yOffset}px)`;
              }).join(' ')}`}
              fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="12,12" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          {/* NODES */}
          {levels.map((level, index) => {
            const yOffset = Math.sin(index) * AMPLITUDE_Y;
            const leftPos = INITIAL_X + (index * HORIZONTAL_GAP);

            return (
              <div
                key={level.tier}
                data-active={level.isCurrentPosition}
                className={clsx(
                  "absolute transition-all duration-500",
                  level.isBoss ? "z-30" : "z-10" // Z-Index més alt
                )}
                style={{
                  left: `${leftPos}px`,
                  // BossMarker va A SOBRE del node, així que el node es manté a la línia
                  top: `calc(50% + ${yOffset}px - 32px)`
                }}
              >
                
                <LevelNode {...level} slug={slug} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}