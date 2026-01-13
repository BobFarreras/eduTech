// filepath: src/app/(dashboard)/leaderboard/page.tsx
import { createClient } from '@/infrastructure/utils/supabase/server';
import { createLeaderboardService } from '@/application/di/container';
import { LeaderboardContainer } from '@/presentation/components/leaderboard/LeaderboardContainer';
import { LeaderboardEntry } from '@/core/entities/leaderboard.entity';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { getGlobalLeaderboard, getUserRank } = createLeaderboardService(supabase);

  // Obtenir l'usuari actual per buscar el seu rànquing
  const { data: { user } } = await supabase.auth.getUser();

  // Execució en paral·lel per a màxima velocitat (Promise.all)
  const [leaderboardData, currentUserRank] = await Promise.all([
    getGlobalLeaderboard.execute(10).catch(err => {
        console.error("Error fetching list", err);
        return [] as LeaderboardEntry[];
    }),
    user ? getUserRank.execute(user.id).catch(err => {
        console.error("Error fetching user rank", err);
        return null;
    }) : Promise.resolve(null)
  ]);

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      
      {/* HEADER AMB NAVEGACIÓ */}
      <header className="max-w-2xl mx-auto mb-8 text-center relative">
        <Link 
            href="/dashboard" 
            className="absolute left-0 top-1 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
            title="Tornar al Dashboard"
        >
            <ArrowLeft className="w-6 h-6" />
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-white">
          Saló de la Fama
        </h1>
        <p className="text-slate-400 mt-2">
          Competició global d'estudiants eduTech.
        </p>
      </header>

      <section>
        <LeaderboardContainer 
            initialEntries={leaderboardData} 
            currentUserRank={currentUserRank}
        />
      </section>
    </main>
  );
}