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

// CONSTANTS DE DISSENY
const CONFIG = {
  AMPLITUDE: 70,        // Amplitud de la corba sinusoïdal (X)
  INITIAL_Y: 60,        // Marge superior inicial
  NORMAL_GAP: 110,      // Distància estàndard entre nodes
  BOSS_GAP_EXTRA: 50,   // Espai extra que afegeix un Boss
  BOTTOM_PADDING: 180   // Espai final de la pàgina
};

// Interface auxiliar per al reduce
interface PositionedNode {
  x: number;
  y: number;
  level: LevelNodeDTO;
  index: number;
}

export function VerticalPath({ levels, slug }: PathProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Càlcul de Posicions (Pure Functional Approach - sense mutacions externes)
  const nodePositions = useMemo(() => {
    // Usem reduce per acumular la Y sense reassignar variables externes
    return levels.reduce<PositionedNode[]>((acc, level, index) => {
      // Càlcul X (Sinusoïdal)
      const x = Math.sin(index) * CONFIG.AMPLITUDE;
      
      let y: number;

      if (index === 0) {
        y = CONFIG.INITIAL_Y;
      } else {
        const prevNode = acc[index - 1];
        let gap = CONFIG.NORMAL_GAP;
        
        // Lògica d'espaiat dinàmic
        if (level.isBoss || prevNode.level.isBoss) {
          gap += CONFIG.BOSS_GAP_EXTRA;
        }
        
        y = prevNode.y + gap;
      }

      // Retornem un nou array amb el nou node (Immutabilitat)
      return [...acc, { x, y, level, index }];
    }, []);
  }, [levels]);

  // 2. Generació del Path SVG (Net i sense variables 'unused')
  const svgPathDefinition = useMemo(() => {
    if (nodePositions.length === 0) return '';

    return nodePositions.map((pos, i) => {
      // Movem al primer punt
      if (i === 0) return `M ${pos.x} ${pos.y}`;

      // Corba de Bezier cap al següent punt
      const prev = nodePositions[i - 1];
      const cpY = (prev.y + pos.y) / 2; // Punt de control a mig camí vertical
      
      // Corba Cúbica: C (Control1 X,Y) (Control2 X,Y) (Final X,Y)
      // Això crea una "S" suau connectant els punts
      return `C ${prev.x} ${cpY}, ${pos.x} ${cpY}, ${pos.x} ${pos.y}`;
    }).join(' ');

  }, [nodePositions]);

  // 3. Auto-Scroll al nivell actiu (UX Improvement)
  useEffect(() => {
    // Petit timeout per assegurar que el DOM s'ha pintat completament
    const timer = setTimeout(() => {
        const activeNode = containerRef.current?.querySelector('[data-active="true"]');
        
        if (activeNode) {
            activeNode.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' // Centra l'element a la pantalla
            });
        }
    }, 100);

    return () => clearTimeout(timer);
  }, [levels]); // S'executa quan canvien els nivells o es munta

  // Càlcul alçada total
  const totalHeight = nodePositions.length > 0 
    ? nodePositions[nodePositions.length - 1].y + CONFIG.BOTTOM_PADDING 
    : 300;

  return (
    <div 
        ref={containerRef}
        className="relative mt-8 w-full flex flex-col items-center pb-24 overflow-hidden"
    >
      
      {/* CONTENIDOR RELATIU MESTRE */}
      <div 
        className="relative w-full max-w-md mx-auto" 
        style={{ height: `${totalHeight}px` }}
      >
        
        {/* CAPA 1: SVG CONNECTOR (Darrere) */}
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0"
          style={{ transform: 'translateX(50%)' }}
        >
          <path
            d={svgPathDefinition}
            fill="none"
            stroke="#475569" // slate-600
            strokeWidth="4"
            strokeDasharray="10, 10"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
        </svg>

        {/* CAPA 2: NODES (Davant) */}
        {nodePositions.map(({ x, y, level, index }) => (
          <div
            key={level.tier}
            // MARQUEM EL NODE ACTIU PER AL SCROLL AUTOMÀTIC
            data-active={level.isCurrentPosition} 
            className={clsx(
              "absolute left-0 top-0 flex justify-center items-center w-full transition-transform duration-500",
              level.isBoss ? "z-20" : "z-10"
            )}
            style={{
              transform: `translate(${x}px, ${y}px) translateY(-50%)`
            }}
          >
            <div className="relative">
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