// filepath: src/app/[locale]/(auth)/register/RegisterForm.tsx
'use client';

import { useActionState } from 'react';
import { authAction } from '@/presentation/actions/auth/auth.action';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function RegisterForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  
  const [state, action, isPending] = useActionState(authAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="intent" value="signup" />

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
        <input 
          name="password" 
          type="password" 
          required 
          minLength={6} 
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          placeholder={t('fields.password_placeholder')} 
        />
      </div>

      {/* MISSATGES (Error i Èxit) */}
      {state?.errorKey && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
        
          ⚠️ {t(state.errorKey)}
        </div>
      )}
      {state?.messageKey && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
 
          ✅ {t(state.messageKey)}
        </div>
      )}

      {/* BOTÓ */}
      <button 
        disabled={isPending} 
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex justify-center items-center shadow-lg"
      >
        {isPending ? <Loader2 className="animate-spin" /> : t('register.submit_button')}
      </button>

      {/* FOOTER */}
      <div className="text-center mt-4 text-sm text-slate-500">
        {t('register.have_account')}{' '}
        <Link 
          href={`/${locale}/login`} 
          className="text-blue-400 hover:underline"
        >
          {t('register.login_link')}
        </Link>
      </div>
    </form>
  );
}