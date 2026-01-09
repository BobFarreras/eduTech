// filepath: src/presentation/actions/auth/auth.action.ts
'use server';

import { createClient } from '@/infrastructure/utils/supabase/server';
import { redirect } from 'next/navigation';

export type AuthState = {
  errorKey?: string; // <--- Canviem 'error' (text) per 'errorKey' (clau i18n)
  messageKey?: string;
};

export async function authAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const intent = formData.get('intent') as string;
  
  const supabase = await createClient();

  if (intent === 'signup') {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: email.split('@')[0] } }
    });

    if (error) {
      // Mapeig d'errors bàsic
      if (error.message.includes('already registered')) return { errorKey: 'auth.errors.user_already_exists' };
      if (error.message.includes('Password')) return { errorKey: 'auth.errors.weak_password' };
      return { errorKey: 'auth.errors.generic' };
    }

    return { messageKey: 'auth.success.check_email' };
  } 
  
  else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Supabase sol retornar "Invalid login credentials" per seguretat
      return { errorKey: 'auth.errors.invalid_credentials' };
    }

    redirect('/');
  }
}