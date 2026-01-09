// filepath: src/app/[locale]/(auth)/login/LoginForm.tsx
'use client';

import { useActionState } from 'react';
import { authAction } from '@/presentation/actions/auth/auth.action';
import { Loader2, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

// 1. IMPORTACIÓ CORRECTA (Arquitectura Centralitzada)
import { Link } from '@/navigation'; 

export function LoginForm() {
  const t = useTranslations('auth');
  
  // 2. HEM ELIMINAT 'const locale = useLocale();' -> Ja no cal!

  const [state, action, isPending] = useActionState(authAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="intent" value="login" />

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          {t('fields.email')}
        </label>
        <input 
          name="email" 
          type="email" 
          required 
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder={t('fields.email_placeholder')}
        />
      </div>
      
      {/* PASSWORD */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">
          {t('fields.password')}
        </label>
        <div className="text-right mb-1">
            {/* TODO: Crear ruta real /forgot-password */}
            <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
              {t('login.forgot_password')}
            </Link>
        </div>
        <input 
          name="password" 
          type="password" 
          required 
          minLength={6}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder={t('fields.password_placeholder')}
        />
      </div>

      {/* ERRORS */}
      {state?.errorKey && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
          ⚠️ <span>{t(state.errorKey)}</span>
        </div>
      )}

      {/* BOTÓ */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex justify-center items-center shadow-lg shadow-blue-900/20"
      >
        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : (
            <span className="flex items-center gap-2">
                {t('login.submit_button')} <LogIn className="w-4 h-4" />
            </span>
        )}
      </button>

      {/* FOOTER LINK - MOLT MÉS NET */}
      <div className="text-center mt-6 text-sm text-slate-500">
        {t('login.no_account')}{' '}
        <Link 
          href="/register" 
          className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
        >
          {t('login.register_link')}
        </Link>
      </div>
    </form>
  );
}