// filepath: src/presentation/components/features/dashboard/TopicCard.tsx
'use client'; 

import Link from 'next/link';
import { DashboardTopicDTO } from '@/application/dto/dashboard-topic.dto';
import { clsx } from 'clsx';
import { Lock, Play } from 'lucide-react';
import * as Icons from '@/presentation/components/icons/icon-library';

// --- FUNCIÓ AMB LOGS DE DEBUG ---
const getTopicIcon = (slug: string, className: string) => {
    // 1. Normalitzem
    const normalizedSlug = slug ? slug.toLowerCase().trim() : '';

    // 2. 🔍 LOG DE DEBUG (Obre la consola del navegador F12 per veure-ho)
    console.log(`[IconDebug] Slug Rebut: "${slug}" | Normalitzat: "${normalizedSlug}"`);

    // 3. Lògica de selecció (Més permissiva amb .includes)
    if (normalizedSlug.includes('react')) return <Icons.ReactIcon className={className} />;
    if (normalizedSlug.includes('type') || normalizedSlug.includes('ts')) return <Icons.TypeScriptIcon className={className} />;
    if (normalizedSlug.includes('supa') || normalizedSlug.includes('sql')) return <Icons.SupabaseIcon className={className} />;
    if (normalizedSlug.includes('docker') || normalizedSlug.includes('container')) return <Icons.DockerIcon className={className} />;
    if (normalizedSlug.includes('legacy') || normalizedSlug.includes('php') || normalizedSlug.includes('back')) return <Icons.PhpIcon className={className} />;
    if (normalizedSlug.includes('security') || normalizedSlug.includes('cyber')) return <Icons.SecurityIcon className={className} />;
    if (normalizedSlug.includes('owasp')) return <Icons.OwaspIcon className={className} />;

    // Default amb avís
    console.warn(`⚠️ [IconDebug] No s'ha trobat icona per a: "${normalizedSlug}". Usant React per defecte.`);
    return <Icons.ReactIcon className={className} />;
}

const getGradient = (slug: string, isLocked: boolean) => {
    if (isLocked) return "bg-slate-900 border-slate-800";
    const s = slug ? slug.toLowerCase() : '';
    
    if (s.includes('react')) return "bg-gradient-to-br from-slate-900 to-blue-900/40 border-blue-900/50 hover:border-blue-500/50";
    if (s.includes('type')) return "bg-gradient-to-br from-slate-900 to-indigo-900/40 border-indigo-900/50 hover:border-indigo-500/50";
    if (s.includes('supa')) return "bg-gradient-to-br from-slate-900 to-emerald-900/40 border-emerald-900/50 hover:border-emerald-500/50";
    if (s.includes('docker')) return "bg-gradient-to-br from-slate-900 to-sky-900/40 border-sky-900/50 hover:border-sky-500/50";
    if (s.includes('legacy') || s.includes('php')) return "bg-gradient-to-br from-slate-900 to-violet-900/40 border-violet-900/50 hover:border-violet-500/50";
    if (s.includes('security') || s.includes('owasp')) return "bg-gradient-to-br from-slate-900 to-red-900/40 border-red-900/50 hover:border-red-500/50";
    
    return "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-slate-500";
}

interface TopicCardProps {
  topic: DashboardTopicDTO;
  translatedTitle: string;
  locale: string;
}

export function TopicCard({ topic, translatedTitle }: TopicCardProps) {
  const Icon = getTopicIcon(topic.slug, "w-10 h-10 md:w-12 md:h-12 drop-shadow-lg transition-transform group-hover:scale-110 duration-300");
  const gradientClass = getGradient(topic.slug, topic.isLocked);

  return (
    <Link 
      href={topic.isLocked ? '#' : `/learn/${topic.slug}`}
      className={clsx(
        "group relative flex flex-col p-5 rounded-[2rem] border transition-all duration-300 w-full h-full",
        gradientClass,
        !topic.isLocked 
          ? "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer" 
          : "opacity-60 cursor-not-allowed grayscale-[0.8]"
      )}
    >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5 shadow-inner min-w-[3.5rem] flex justify-center">
                {Icon}
            </div>
            
            {topic.isLocked ? (
                <Lock className="w-5 h-5 text-slate-600" />
            ) : (
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nivell {topic.currentLevel}</span>
                    <div className="flex gap-0.5 mt-1">
                        {/* Indicadors de nivell (3 punts) */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className={clsx("w-1.5 h-1.5 rounded-full", i <= Math.ceil(topic.progressPercentage / 33) ? "bg-green-400 shadow-[0_0_5px_#4ade80]" : "bg-slate-800")} />
                        ))}
                    </div>
                 </div>
            )}
        </div>

        {/* BODY */}
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <h3 className={clsx(
                    "font-black text-white leading-tight mb-2 transition-colors group-hover:text-blue-200",
                    translatedTitle.length > 20 ? "text-lg" : "text-xl md:text-2xl"
                )}>
                    {translatedTitle}
                </h3>
            </div>
            
            {!topic.isLocked && (
                <div className="mt-4">
                    {/* Text de progrés detallat */}
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                       <span className="text-blue-300">{topic.progressPercentage}% Completat</span>
                    </div>

                    <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 relative" 
                            style={{ width: `${Math.max(topic.progressPercentage, 5)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Play Button igual */}
        {!topic.isLocked && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                 </div>
            </div>
        )}
    </Link>
  );
}