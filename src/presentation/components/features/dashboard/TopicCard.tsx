'use client'; // Assegura't que és un client component

import Link from 'next/link';
import { DashboardTopicDTO } from '@/application/dto/dashboard-topic.dto';
import { getTopicIcon } from '@/presentation/utils/icon-mapper';
import { getLocalizedText } from '@/core/utils/i18n-utils'; // ✅ Importem la utilitat
import { clsx } from 'clsx';
import { ArrowRight, Lock } from 'lucide-react';

interface TopicCardProps {
  topic: DashboardTopicDTO;
  translatedTitle: string;
  locale: string; // ✅ NOU: Rebem l'idioma des del pare
}

export function TopicCard({ topic, translatedTitle, locale }: TopicCardProps) {
  const themeColor = topic.colorTheme || 'bg-slate-700';
  
  // ✅ FIX: Ara no peta perquè usem la prop directa, no el hook
  const translatedDescription = getLocalizedText(topic.description, locale);

  return (
    <Link 
      href={topic.isLocked ? '#' : `/learn/${topic.slug}`}
      className={clsx(
        "group relative flex flex-col bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden transition-all duration-200",
        !topic.isLocked && "hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_8px_0_0_#1e293b] active:translate-y-0 active:shadow-none",
        topic.isLocked && "opacity-60 cursor-not-allowed grayscale"
      )}
    >
      {/* HEADER DE COLOR */}
      <div className={clsx("h-24 flex items-center justify-center relative overflow-hidden", themeColor)}>
         <div className="absolute inset-0 bg-black/10" /> 
         <div className="text-white drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
            {getTopicIcon(topic.iconName, "w-12 h-12")}
         </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex-1 flex flex-col">
       <h3 className="text-lg font-bold text-white mb-1">{translatedTitle}</h3>
       
       {/* ✅ FIX: Ara pintem un string, no l'objecte sencer */}
       <p className="text-slate-400 text-xs mb-4 line-clamp-2">
         {translatedDescription}
       </p>

       {/* BARRA DE PROGRÉS */}
       <div className="mt-auto">
           <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider">
              <span className={topic.isLocked ? "text-slate-600" : "text-blue-400"}>
                 {topic.isLocked ? "Bloquejat" : `Nivell ${topic.currentLevel}`}
              </span>
              <span className="text-slate-500">{topic.progressPercentage}%</span>
           </div>
           
           <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className={clsx("h-full rounded-full transition-all duration-1000", 
                    topic.isLocked ? "bg-slate-600" : "bg-blue-500"
                )}
                style={{ width: `${topic.progressPercentage}%` }}
              />
           </div>
        </div>
      </div>

      {/* BOTÓ D'ACCIÓ */}
      {!topic.isLocked && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                 <ArrowRight className="w-4 h-4 text-white" />
              </div>
          </div>
      )}
      
      {topic.isLocked && (
         <div className="absolute top-3 right-3">
             <Lock className="w-5 h-5 text-white/50" />
         </div>
      )}
    </Link>
  );
}