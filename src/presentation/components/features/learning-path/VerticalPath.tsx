// filepath: src/presentation/components/features/learning-path/VerticalPath.tsx
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNode } from './LevelNode';
import { clsx } from 'clsx';

interface PathProps {
  levels: LevelNodeDTO[];
  slug: string;
}

const CONFIG = {
  AMPLITUDE: 70,       
  INITIAL_Y: 80,        // ⬆️ FIX: Augmentem marge inicial perquè el badge START tingui espai a dalt
  NORMAL_GAP: 110,      
  BOSS_GAP_EXTRA: 50,   
  BOTTOM_PADDING: 180   
};

interface PositionedNode {
  x: number;
  y: number;
  level: LevelNodeDTO;
  index: number;
}

export function VerticalPath({ levels, slug }: PathProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const nodePositions = useMemo(() => {
    return levels.reduce<PositionedNode[]>((acc, level, index) => {
      const x = Math.sin(index) * CONFIG.AMPLITUDE;
      
      let y: number;
      if (index === 0) {
        y = CONFIG.INITIAL_Y;
      } else {
        const prevNode = acc[index - 1];
        let gap = CONFIG.NORMAL_GAP;
        if (level.isBoss || prevNode.level.isBoss) {
          gap += CONFIG.BOSS_GAP_EXTRA;
        }
        y = prevNode.y + gap;
      }
      return [...acc, { x, y, level, index }];
    }, []);
  }, [levels]);

  const svgPathDefinition = useMemo(() => {
    if (nodePositions.length === 0) return '';
    return nodePositions.map((pos, i) => {
      if (i === 0) return `M ${pos.x} ${pos.y}`;
      const prev = nodePositions[i - 1];
      const cpY = (prev.y + pos.y) / 2;
      return `C ${prev.x} ${cpY}, ${pos.x} ${cpY}, ${pos.x} ${pos.y}`;
    }).join(' ');
  }, [nodePositions]);

  useEffect(() => {
    const timer = setTimeout(() => {
        const activeNode = containerRef.current?.querySelector('[data-active="true"]');
        if (activeNode) {
            activeNode.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [levels]);

  const totalHeight = nodePositions.length > 0 
    ? nodePositions[nodePositions.length - 1].y + CONFIG.BOTTOM_PADDING 
    : 300;

  return (
    <div 
        ref={containerRef}
        // 🛑 FIX CRÍTIC: Eliminem 'overflow-hidden' i afegim 'overflow-visible'
        // Això permet que el badge START sobresurti sense ser tallat.
        className="relative mt-8 w-full flex flex-col items-center pb-24 overflow-visible"
    >
      
      <div 
        className="relative w-full max-w-md mx-auto" 
        style={{ height: `${totalHeight}px` }}
      >
        
        {/* CAPA 1: SVG (Z-0) */}
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0"
          style={{ transform: 'translateX(50%)' }}
        >
          <path
            d={svgPathDefinition}
            fill="none"
            stroke="#475569" 
            strokeWidth="4"
            strokeDasharray="10, 10"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
        </svg>

        {/* CAPA 2: NODES */}
        {nodePositions.map(({ x, y, level, index }) => (
          <div
            key={level.tier}
            data-active={level.isCurrentPosition} 
            className={clsx(
              "absolute left-0 top-0 flex justify-center items-center w-full transition-transform duration-500",
              // ⬆️ FIX Z-INDEX: Si és la posició actual, li donem prioritat màxima (50) sobre qualsevol altre node veí.
              level.isCurrentPosition ? "z-50" : (level.isBoss ? "z-20" : "z-10")
            )}
            style={{
              transform: `translate(${x}px, ${y}px) translateY(-50%)`
            }}
          >
            {/* Afegim 'pointer-events-auto' per assegurar clicks */}
            <div className="relative pointer-events-auto">
              <LevelNode 
                {...level} 
                slug={slug} 
                index={index} 
              />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}