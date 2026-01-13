// filepath: src/infrastructure/repositories/supabase-profile.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { IProfileRepository } from '@/core/repositories/profile.repository';
import { UserProfile, EditableProfileFields } from '@/core/entities/user-profile.entity';

export class SupabaseProfileRepository implements IProfileRepository {
  constructor(private supabase: SupabaseClient) {}

  async getById(userId: string): Promise<UserProfile | null> {
    // 1. Obtenim les dades públiques del perfil
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('id, username, avatar_icon, total_xp, current_level, streak_days, updated_at')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;

    // 2. Intentem obtenir dades privades
    const { data: { user } } = await this.supabase.auth.getUser();
    
    // Validem si som nosaltres mateixos
    const isMe = user?.id === userId;

    // 3. Mapeig (Mapping) DB -> Entity
    return {
      id: profile.id,
      email: isMe && user?.email ? user.email : 'hidden@email.com',
      username: profile.username || 'Anonymous',
      avatarIcon: profile.avatar_icon || '🤖',
      totalXp: profile.total_xp,
      level: profile.current_level,
      streakDays: profile.streak_days,
      joinedAt: isMe && user?.created_at ? new Date(user.created_at) : new Date(profile.updated_at)
    };
  }

  async update(userId: string, data: EditableProfileFields): Promise<void> {
    // 1. Mapeig Entity -> DB (Strict Typing)
    // Definim un tipus local que representa EXACTAMENT les columnes que volem tocar a la BD
    type ProfileUpdatePayload = {
        username?: string;
        avatar_icon?: string;
    };

    const dbPayload: ProfileUpdatePayload = {};
    
    // Ara TypeScript sap que 'username' i 'avatar_icon' són vàlids, però 'level' no ho seria.
    if (data.username !== undefined) dbPayload.username = data.username;
    if (data.avatarIcon !== undefined) dbPayload.avatar_icon = data.avatarIcon;

    // 2. Execució
    const { error } = await this.supabase
      .from('profiles')
      .update(dbPayload)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('No s\'ha pogut actualitzar el perfil.');
    }
  }
}