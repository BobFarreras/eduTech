// filepath: src/presentation/components/profile/ProfileForm.tsx
'use client';

import { UserProfile } from '@/core/entities/user-profile.entity';
import { updateProfileAction, ProfileFormState } from '@/presentation/actions/profile/profile.actions'; // Fix path import
import { useActionState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl'; // <--- IMPORT

import { EmojiSelector } from './EmojiSelector';
import { ProfileStats } from './ProfileStats';

interface Props {
  profile: UserProfile;
}

const initialState: ProfileFormState = {
  success: false,
  message: '',
  error: undefined
};

export function ProfileForm({ profile }: Props) {
  const t = useTranslations('profile.form'); // <--- HOOK
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      
      <div className="lg:col-span-4">
        <ProfileStats profile={profile} />
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="mb-6 pb-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">{t('configuration')}</h3>
                <p className="text-sm text-slate-400">{t('configuration_desc')}</p>
            </div>

            <input type="hidden" name="userId" value={profile.id} />

            <div className="mb-8">
                <EmojiSelector currentAvatar={profile.avatarIcon} />
            </div>

            <div className="mb-8">
                <label htmlFor="username" className="block text-sm font-medium text-slate-400 mb-2">
                    {t('username_label')}
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        defaultValue={profile.username}
                        minLength={3}
                        maxLength={20}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700"
                        placeholder={t('username_placeholder')}
                    />
                    <div className="absolute right-3 top-3.5 text-xs text-slate-600 font-mono pointer-events-none">
                        {t('username_help', { min: 3, max: 20 })} {/* <--- Variable substitution */}
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="p-4 mb-6 bg-red-900/10 border border-red-500/20 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <p className="text-red-200 text-sm mt-0.5">{state.error}</p>
                </div>
            )}
            
            {state?.success && (
                <div className="p-4 mb-6 bg-green-900/10 border border-green-500/20 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
                    <span className="text-green-500 text-lg">🎉</span>
                    <p className="text-green-200 text-sm mt-0.5">{state.message}</p>
                </div>
            )}

            <div className="flex justify-end pt-2">
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="
                        flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95
                        text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    "
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{isPending ? t('saving_button') : t('save_button')}</span>
                </button>
            </div>
        </div>
      </div>
    </form>
  );
}