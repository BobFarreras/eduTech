// filepath: src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('app');
  const tGame = useTranslations('game');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          {t('name')}
        </h1>
      </div>

      <div className="mt-10 border border-slate-700 p-10 rounded-xl bg-slate-800">
        <p className="text-xl mb-6">Benvingut al futur de l'aprenentatge.</p>
        
        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all">
          {tGame('start')}
        </button>
      </div>

      <div className="mt-10 text-slate-400">
        <p>Ruta actual: /src/app/[locale]/page.tsx</p>
      </div>
    </main>
  );
}