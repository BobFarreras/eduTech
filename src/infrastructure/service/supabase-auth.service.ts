// filepath: src/infrastructure/services/supabase-auth.service.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IAuthService, UserIdentity } from '@/core/services/auth.service';

export class SupabaseAuthService implements IAuthService {
  
  async logout(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  async getUser(): Promise<UserIdentity | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) return null;
    
    return {
      id: user.id,
      email: user.email
    };
  }
}