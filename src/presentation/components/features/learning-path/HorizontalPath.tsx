// filepath: src/presentation/components/features/learning-path/HorizontalPath.tsx
'use client';

import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';
import { useRef, useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}

export function HorizontalPath({ levels, slug }: PathProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null); // Referència per al bucle d'animació
  
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Constants
  const SCROLL_SPEED = 12; // Píxels per frame (ajusta-ho si va molt ràpid o lent)
  const AMPLITUDE_Y = 60;
  const HORIZONTAL_GAP = 160;
  const INITIAL_X = 100;
  const totalWidth = (levels.length * HORIZONTAL_GAP) + 200;

  // --- LOGICA DE VISIBILITAT DELS BOTONS ---
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // --- LOGICA DE SCROLL CONTINU (HOLD TO SCROLL) ---
  
  const startScrolling = (direction: 'left' | 'right') => {
    // Si ja estem fent scroll, no fem res
    if (animationRef.current) return;

    const scrollLoop = () => {
      if (scrollRef.current) {
        const amount = direction === 'left' ? -SCROLL_SPEED : SCROLL_SPEED;
        scrollRef.current.scrollLeft += amount; // Modificació directa per màxima suavitat
        
        // Continuem el bucle
        animationRef.current = requestAnimationFrame(scrollLoop);
      }
    };

    // Iniciem el bucle
    scrollLoop();
  };

  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // --- EFECTES ---
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
  }, [levels, handleScroll]);

  // Classes comunes pel botó
  const buttonClass = "bg-slate-800 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl border-2 border-slate-600 hover:border-blue-400 backdrop-blur-md transition-all active:scale-95 pointer-events-auto flex items-center justify-center select-none";

  return (
    <div className="relative w-full h-[80vh] group">

      {/* --- BOTÓ ESQUERRA --- */}
      <div className={clsx(
        "absolute left-0 top-0 bottom-0 w-32 z-[9999] flex items-center justify-start pl-6 transition-opacity duration-300 pointer-events-none bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent",
        showLeft ? "opacity-100" : "opacity-0"
      )}>
        <button 
          // Esdeveniments per a ratolí
          onMouseDown={() => startScrolling('left')}
          onMouseUp={stopScrolling}
          onMouseLeave={stopScrolling} // Important: si surt del botó, para
          // Esdeveniments per a tàctil (mòbil)
          onTouchStart={() => startScrolling('left')}
          onTouchEnd={stopScrolling}
          
          className={buttonClass}
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* --- BOTÓ DRETA --- */}
      <div className={clsx(
        "absolute right-0 top-0 bottom-0 w-32 z-[9999] flex items-center justify-end pr-6 transition-opacity duration-300 pointer-events-none bg-linear-to-l from-slate-950 via-slate-950/80 to-transparent",
        showRight ? "opacity-100" : "opacity-0"
      )}>
        <button 
          // Esdeveniments per a ratolí
          onMouseDown={() => startScrolling('right')}
          onMouseUp={stopScrolling}
          onMouseLeave={stopScrolling}
          // Esdeveniments per a tàctil
          onTouchStart={() => startScrolling('right')}
          onTouchEnd={stopScrolling}

          className={buttonClass}
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* --- SCROLL AREA --- */}
      <div ref={scrollRef} className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="relative h-full flex items-center" style={{ minWidth: `${totalWidth}px` }}>

          {/* SVG LINE (Amb el fix de .toFixed(2) inclòs) */}
          <svg className="absolute left-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
            <path
              d={`M ${INITIAL_X} 50% ${levels.map((_, i) => {
                const yOffset = (Math.sin(i) * AMPLITUDE_Y).toFixed(2);
                return `L ${INITIAL_X + (i * HORIZONTAL_GAP)}px calc(50% + ${yOffset}px)`;
              }).join(' ')}`}
              fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="12,12" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          {/* NODES (Amb el fix de .toFixed(2) inclòs) */}
          {levels.map((level, index) => {
            const yOffset = (Math.sin(index) * AMPLITUDE_Y).toFixed(2);
            const leftPos = INITIAL_X + (index * HORIZONTAL_GAP);

            return (
              <div
                key={level.tier}
                data-active={level.isCurrentPosition}
                className={clsx(
                  "absolute transition-all duration-500",
                  level.isBoss ? "z-30" : "z-10"
                )}
                style={{
                  left: `${leftPos}px`,
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