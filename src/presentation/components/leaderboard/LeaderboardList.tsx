// filepath: src/presentation/components/leaderboard/LeaderboardList.tsx
import { LeaderboardEntry } from '@/core/entities/leaderboard.entity';
import { Trophy, Medal } from 'lucide-react'; // Assegura't de tenir lucide-react instal·lat

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardList({ entries }: Props) {
  
  // Helper per assignar estils segons la posició
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-400 text-yellow-800'; // Or
      case 2: return 'bg-gray-100 border-gray-400 text-gray-800';       // Plata
      case 3: return 'bg-orange-100 border-orange-400 text-orange-800'; // Bronze
      default: return 'bg-white border-slate-200 text-slate-700';       // Resta
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 2: return <Medal className="w-5 h-5 text-gray-600" />;
      case 3: return <Medal className="w-5 h-5 text-orange-600" />;
      default: return <span className="font-bold text-slate-500">#{rank}</span>;
    }
  };

  if (entries.length === 0) {
    return <div className="p-8 text-center text-slate-500">No hi ha dades encara.</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
      {entries.map((entry) => (
        <div 
          key={entry.userId}
          className={`
            relative flex items-center justify-between p-4 rounded-xl border-2 shadow-sm transition-all
            ${getRankStyle(entry.rank)}
            ${entry.isCurrentUser ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
          `}
        >
          {/* Esquerra: Rànquing i Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex flex-col">
              <span className={`font-bold ${entry.isCurrentUser ? 'text-indigo-700' : ''}`}>
                {entry.username} {entry.isCurrentUser && '(Tu)'}
              </span>
              <span className="text-xs opacity-80">Nivell {entry.level}</span>
            </div>
          </div>

          {/* Dreta: XP */}
          <div className="font-mono font-bold text-lg">
            {new Intl.NumberFormat('ca-ES').format(entry.xp)} XP
          </div>
        </div>
      ))}
    </div>
  );
}