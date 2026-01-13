// filepath: src/presentation/components/leaderboard/LeaderboardContainer.tsx
'use client';

import { useState } from 'react';
import { LeaderboardEntry } from '@/core/entities/leaderboard.entity';
import { getLeaderboardAction } from '@/presentation/actions/leaderboard/leaderboard.actions'; // Assegura't que la ruta sigui correcta
import { Trophy, Medal, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

// 1. DEFINIM EL TIPUS PER A LA FUNCIÓ DE TRADUCCIÓ
// Això evita l'ús de 'any' i manté TypeScript content.
type TranslationFn = (key: string) => string;

// --- HELPER FUNCTIONS ---
const getRankStyle = (rank: number, isMe: boolean) => {
    if (isMe) return 'bg-blue-900/30 border-blue-500/50 text-blue-100 ring-2 ring-blue-500';
    switch (rank) {
        case 1: return 'bg-yellow-900/20 border-yellow-500/50 text-yellow-100';
        case 2: return 'bg-slate-700/30 border-slate-400/50 text-slate-100';
        case 3: return 'bg-orange-900/20 border-orange-500/50 text-orange-100';
        default: return 'bg-slate-800/40 border-slate-700 text-slate-300';
    }
};

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
        case 2: return <Medal className="w-5 h-5 text-gray-300" />;
        case 3: return <Medal className="w-5 h-5 text-orange-400" />;
        default: return <span className="font-mono font-bold text-slate-400 w-5 text-center">{rank}</span>;
    }
};

// --- SUB-COMPONENT RowItem ---
// 2. CORRECCIÓ: Substituïm 'any' pel tipus definit 'TranslationFn'
const RowItem = ({ entry, t }: { entry: LeaderboardEntry, t: TranslationFn }) => (
    <div
        className={`relative flex items-center justify-between p-3 md:p-4 rounded-xl border transition-all ${getRankStyle(entry.rank, entry.isCurrentUser)}`}
    >
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            {/* 1. Icona de Posició */}
            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                {getRankIcon(entry.rank)}
            </div>
            
            {/* 2. AVATAR (Emoji) */}
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-slate-900/50 rounded-xl text-xl md:text-2xl border border-white/5 flex-shrink-0">
                {entry.avatarIcon}
            </div>

            {/* 3. Informació Usuari */}
            <div className="flex flex-col min-w-0">
                <span className={`font-bold truncate ${entry.isCurrentUser ? 'text-blue-300' : 'text-slate-200'}`}>
                    {entry.username} {entry.isCurrentUser && <span className="text-xs opacity-70 ml-1">{t('you')}</span>}
                </span>
                <span className="text-xs opacity-60 truncate">{t('level')} {entry.level}</span>
            </div>
        </div>

        {/* 4. XP */}
        <div className="font-mono font-bold text-base md:text-lg text-slate-200 pl-2 flex-shrink-0">
            {new Intl.NumberFormat('ca-ES').format(entry.xp)} <span className="text-xs font-normal opacity-50">XP</span>
        </div>
    </div>
);

// --- COMPONENT PRINCIPAL ---
interface Props {
    initialEntries: LeaderboardEntry[];
    currentUserRank: LeaderboardEntry | null;
}

export function LeaderboardContainer({ initialEntries, currentUserRank }: Props) {
    const t = useTranslations('leaderboard'); 
    const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
    const [offset, setOffset] = useState(initialEntries.length);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const isUserVisible = entries.some(e => e.isCurrentUser);

    const loadMore = async () => {
        setLoading(true);
        // Assegura't de passar els paràmetres correctes a l'acció
        const result = await getLeaderboardAction({ limit: 10, offset });

        if (result.success && result.data) {
            if (result.data.length < 10) setHasMore(false);
            setEntries(prev => [...prev, ...result.data]);
            setOffset(prev => prev + 10);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto pb-40 md:pb-24">
            {/* LLISTA PRINCIPAL */}
            <div className="flex flex-col gap-3">
                {entries.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 italic">
                        {t('empty')}
                    </div>
                ) : (
                    entries.map((entry) => (
                        <RowItem key={entry.userId} entry={entry} t={t} />
                    ))
                )}
            </div>

            {/* BOTÓ CARREGAR MÉS */}
            {hasMore && entries.length > 0 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors disabled:opacity-50 text-sm font-bold"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                        {loading ? t('loading') : t('load_more')}
                    </button>
                </div>
            )}

            {/* STICKY USER STATS */}
            {currentUserRank && !isUserVisible && (
                <div className={`
                    fixed 
                    left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-40 
                    animate-in slide-in-from-bottom-10 fade-in duration-500
                    bottom-24 md:bottom-6  
                `}>
                    <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-1 rounded-2xl shadow-2xl shadow-black/50">
                        
                        <RowItem entry={currentUserRank} t={t} />
                    </div>
                </div>
            )}
        </div>
    );
}