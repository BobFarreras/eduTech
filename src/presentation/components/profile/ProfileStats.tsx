// filepath: src/presentation/components/profile/ProfileStats.tsx
import { UserProfile } from '@/core/entities/user-profile.entity';
import { Calendar, Trophy, Zap, Clock } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

export function ProfileStats({ profile }: Props) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col">
      {/* CAPÇALERA COMPACTA */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800/50">
        <div className="
            flex items-center justify-center w-16 h-16 text-4xl 
            bg-slate-950 rounded-2xl border border-slate-800 shadow-inner
        ">
          {profile.avatarIcon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">{profile.username}</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wide border border-blue-500/20">
                Nivell {profile.level}
             </span>
             <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(profile.joinedAt).getFullYear()}
             </span>
          </div>
        </div>
      </div>

      {/* GRID D'STATS */}
      <div className="grid grid-cols-2 gap-3 flex-1">
         <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 flex flex-col items-center justify-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-2xl font-black text-white">{new Intl.NumberFormat('ca-ES').format(profile.totalXp)}</span>
            <span className="text-[10px] uppercase text-slate-500 font-bold">XP Total</span>
         </div>
         <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 flex flex-col items-center justify-center gap-1">
            <Zap className="w-5 h-5 text-orange-500 mb-1" />
            <span className="text-2xl font-black text-white">{profile.streakDays}</span>
            <span className="text-[10px] uppercase text-slate-500 font-bold">Dies Rata</span>
         </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-600">
           ID: <span className="font-mono">{profile.email}</span>
        </p>
      </div>
    </div>
  );
}