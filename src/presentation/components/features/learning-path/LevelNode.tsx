// filepath: src/presentation/components/features/learning-path/LevelNode.tsx
import Link from 'next/link';
import { Check, Lock, Terminal, Puzzle, Brain, User } from 'lucide-react'; 
import { clsx } from 'clsx';
import { LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenge.entity';

interface LevelNodeProps {
  tier: number;
  status: LevelStatus;
  slug: string;
  index: number;
  predominantType?: ChallengeType;
  isCurrentPosition?: boolean;
}

// ✅ HELPER EXTERN (Net i eficient)
function getIcon(status: string, type: string) {
  if (status === 'LOCKED') return <Lock className="w-8 h-8" />;
  if (status === 'COMPLETED') return <Check className="w-10 h-10 stroke-3" />;

  switch (type) {
    case 'CODE_FIX': return <Terminal className="w-8 h-8" />;
    case 'MATCHING': return <Puzzle className="w-8 h-8" />;
    default: return <Brain className="w-8 h-8" />;
  }
}

export function LevelNode({ tier, status, slug, index, predominantType = 'QUIZ', isCurrentPosition }: LevelNodeProps) {
  const offsetClass = index % 2 === 0 ? '-translate-x-8' : 'translate-x-8';

  const baseStyles = "relative w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-8 transition-all duration-300 z-10";
  
  const statusStyles = {
    LOCKED: "bg-slate-800 border-slate-950 text-slate-600 cursor-not-allowed grayscale",
    COMPLETED: "bg-emerald-500 border-emerald-700 text-white hover:scale-105",
    ACTIVE: "bg-blue-600 border-blue-800 text-white hover:scale-110 shadow-[0_0_30px_rgba(37,99,235,0.6)]"
  };

  const content = (
    <div className="relative">
        {/* EFECTE ONADES (Només si és ACTIVE) */}
        {status === 'ACTIVE' && (
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20 duration-1000 scale-150 pointer-events-none"></span>
        )}

        {/* CERCLE PRINCIPAL (Aquí és on aplicaven els estils que et fallaven) */}
        <div className={clsx(baseStyles, statusStyles[status], "group")}>
            
            {/* ICONA */}
            {getIcon(status, predominantType)}
            
            {/* ETIQUETA NIVEL */}
            <div className="absolute -bottom-8 bg-slate-900 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700 whitespace-nowrap">
                NIVELL {tier}
            </div>
        </div>

        {/* INDICADOR "ESTÀS AQUÍ" */}
        {isCurrentPosition && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-subtle z-20">
                <div className="bg-white text-blue-900 p-1.5 rounded-full border-2 border-blue-500 shadow-lg">
                    <User className="w-5 h-5 fill-current" />
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-blue-500 -mt-0.5"></div>
            </div>
        )}
    </div>
  );

  if (status === 'LOCKED') {
    return <div className={clsx("flex justify-center py-6", offsetClass)}>{content}</div>;
  }

  return (
    <div className={clsx("flex justify-center py-6", offsetClass)}>
      <Link href={`/learn/${slug}/play?tier=${tier}`}>
        {content}
      </Link>
    </div>
  );
}