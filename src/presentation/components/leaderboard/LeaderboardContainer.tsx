// filepath: src/presentation/components/leaderboard/LeaderboardContainer.tsx
'use client';

import { useState } from 'react';
import { LeaderboardEntry } from '@/core/entities/leaderboard.entity';
import { getLeaderboardAction } from '@/presentation/actions/leaderboard/leaderboard.actions';
import { Trophy, Medal, ChevronDown, Loader2 } from 'lucide-react';

// --- HELPER FUNCTIONS (FORA DEL COMPONENT) ---
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

// --- SUB-COMPONENT (FORA DEL COMPONENT PRINCIPAL) ---
const RowItem = ({ entry }: { entry: LeaderboardEntry }) => (
    <div
        className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${getRankStyle(entry.rank, entry.isCurrentUser)}`}
    >
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(entry.rank)}
            </div>
            <div className="flex flex-col">
                <span className={`font-bold ${entry.isCurrentUser ? 'text-blue-300' : ''}`}>
                    {entry.username} {entry.isCurrentUser && '(Tu)'}
                </span>
                <span className="text-xs opacity-60">Nivell {entry.level}</span>
            </div>
        </div>
        <div className="font-mono font-bold text-lg text-slate-200">
            {new Intl.NumberFormat('ca-ES').format(entry.xp)} XP
        </div>
    </div>
);

// --- COMPONENT PRINCIPAL ---
interface Props {
    initialEntries: LeaderboardEntry[];
    currentUserRank: LeaderboardEntry | null;
}

export function LeaderboardContainer({ initialEntries, currentUserRank }: Props) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
    const [offset, setOffset] = useState(initialEntries.length);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Comprovar si l'usuari ja està visible a la llista carregada
    const isUserVisible = entries.some(e => e.isCurrentUser);

    const loadMore = async () => {
        setLoading(true);
        const result = await getLeaderboardAction({ limit: 10, offset });

        if (result.success && result.data) {
            if (result.data.length < 10) setHasMore(false);
            setEntries(prev => [...prev, ...result.data]);
            setOffset(prev => prev + 10);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto pb-24">

            {/* LLISTA PRINCIPAL */}
            <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                    <RowItem key={entry.userId} entry={entry} />
                ))}
            </div>

            {/* BOTÓ CARREGAR MÉS */}
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                        {loading ? 'Carregant...' : 'Carregar-ne més'}
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
                    {/* 👆 EXPLICACIÓ DEL CANVI CSS:
              - bottom-24: Al mòbil, el posem 6rem (96px) amunt per salvar la Navbar.
              - md:bottom-6: A l'escriptori, el baixem a 1.5rem perquè no hi ha Navbar.
          */}
                    <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-1 rounded-2xl shadow-2xl shadow-black/50">
                        <div className="text-xs text-center text-blue-400 font-bold uppercase tracking-wider mb-1 pt-1">
                            La teva posició actual
                        </div>
                        <RowItem entry={currentUserRank} />
                    </div>
                </div>
            )}
        </div>
    );
}