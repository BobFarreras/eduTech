// filepath: src/app/[locale]/(game)/learn/[slug]/page.tsx
import { getNextChallengeAction } from '@/presentation/actions/challenges/get-next-challenge.action';
import { GameArena } from '@/presentation/components/features/game-engine/GameArena';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function LearnPage({ params }: PageProps) {
  const { slug } = await params;
  const response = await getNextChallengeAction(slug);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center text-slate-400 hover:text-white transition-colors">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Tornar al Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!response.success ? (
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
            <p className="text-slate-400">{response.error}</p>
            <Link href="/" className="mt-6 inline-block text-blue-400 hover:underline">
              Tornar a l'inici
            </Link>
          </div>
        ) : !response.data || response.data.length === 0 ? ( 
          // CORRECCIÓ: Comprovem length perquè ara és un array
          <div className="text-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Felicitats! 🎉</h1>
            <p className="text-xl text-slate-300">Has completat tots els reptes d'aquest tema.</p>
            <Link href="/" className="mt-8 inline-block px-6 py-3 bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-500">
              Triar un altre tema
            </Link>
          </div>
        ) : (
          // CORRECCIÓ CLAU: Passem 'challenges' (plural) enlloc de 'challenge'
          <GameArena challenges={response.data} />
        )}
      </div>
    </main>
  );
}