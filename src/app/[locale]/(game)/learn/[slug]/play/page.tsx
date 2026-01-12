// filepath: src/app/[locale]/(game)/learn/[slug]/play/page.tsx
import { getNextChallengeAction } from '@/presentation/actions/challenges/get-next-challenge.action';
import { GameArena } from '@/presentation/components/features/game-engine/GameArena';
// 1. IMPORT CORRECTE PER A i18n
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';

interface PlayPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ tier?: string }>;
}

export default async function PlayPage({ params, searchParams }: PlayPageProps) {
  const { slug } = await params;
  const { tier } = await searchParams;

  // 2. Determinar Dificultat (Tier)
  const difficulty = tier ? parseInt(tier, 10) : 1;

  // 3. Cridar l'Acció passant el NIVELL
  // (Nota: Ara haurem d'actualitzar l'acció per acceptar aquest paràmetre)
  const response = await getNextChallengeAction(slug, difficulty);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* HEADER DE JOC */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          {/* 4. UX MILLORADA: Tornar al MAPA, no a l'inici */}
          <Link
            href={`/learn/${slug}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Sortir del nivell</span>
          </Link>

          {/* Badge de Nivell */}
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
            Tier {difficulty}
          </div>
        </div>
      </header>

      {/* ZONA DE JOC */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-5xl mx-auto">
        {!response.success ? (
          <div className="text-center max-w-md p-8 bg-slate-900 border border-red-900/50 rounded-2xl">
            <h1 className="text-xl font-bold text-red-400 mb-2">Error de càrrega</h1>
            <p className="text-slate-400 mb-6">{response.error}</p>
            <Link href={`/learn/${slug}`} className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              Tornar al Mapa
            </Link>
          </div>
        ) : !response.data || response.data.length === 0 ? (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500 mb-4">
              Nivell Completat!
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mx-auto mb-8">
              Ja has superat tots els reptes d'aquest nivell de dificultat.
            </p>
            <Link
              href={`/learn/${slug}`}
              className="inline-flex items-center px-8 py-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
            >
              Tornar al Mapa
            </Link>
          </div>
        ) : (
          // ✅ AQUÍ ESTÀ EL CANVI: PASSEM EL SLUG
          <GameArena
            challenges={response.data}
            topicSlug={slug} // <--- CONNEXIÓ FINAL
          />
        )}
      </div>
    </main>
  );
}