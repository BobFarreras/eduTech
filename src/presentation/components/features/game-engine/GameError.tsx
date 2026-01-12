// filepath: src/presentation/components/features/game-engine/GameError.tsx
import { AlertTriangle, RotateCcw, LogIn } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface GameErrorProps {
  message: string;
  onRetry: () => void;
}

export function GameError({ message, onRetry }: GameErrorProps) {
  const t = useTranslations('game.arena');
  const isAuthError = message.includes('Unauthorized');

  return (
    <div className="text-center max-w-sm bg-slate-800 p-8 rounded-2xl border border-red-500/20 mx-auto">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
         {isAuthError ? <LogIn className="w-8 h-8 text-blue-400" /> : <AlertTriangle className="w-8 h-8 text-red-400" />}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {isAuthError ? t('unauthorized_title') : t('error_title')}
      </h3>
      
      {/* Si l'error és tècnic, el mostrem tal qual o un genèric si prefereixes */}
      <p className="text-slate-400 mb-6 text-sm">
        {isAuthError ? t('unauthorized_desc') : message}
      </p>

      <div className="flex gap-3 justify-center">
        {isAuthError ? (
           <Link href="/login">
             <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">
                {t('login_btn')}
             </button>
           </Link>
        ) : (
           <button onClick={onRetry} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-2">
             <RotateCcw className="w-4 h-4" /> {t('retry_btn')}
           </button>
        )}
      </div>
    </div>
  );
}