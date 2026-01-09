// filepath: src/infrastructure/repositories/supabase/user.repository.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IUserRepository, UserProfile } from '@/core/repositories/user.repository'; // Assegura't que aquesta interfície existeix al Core

export class SupabaseUserRepository implements IUserRepository {
  
  async findById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();
    
    // Obtenim el perfil de la taula 'profiles'
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      totalXp: data.total_xp || 0,
      level: data.level || 1,
      // Mapem altres camps si cal
    };
  }

  async saveProgress(userId: string, challengeIds: string[], topicId: string, xpPerChallenge: number): Promise<void> {
    const supabase = await createClient();

    // Guardem cada repte completat a 'user_progress'
    // Usem upsert per evitar errors si ja existeix
    const progressInserts = challengeIds.map(challengeId => ({
      user_id: userId,
      challenge_id: challengeId,
      topic_id: topicId,
      completed_at: new Date().toISOString(),
      xp_earned: xpPerChallenge
    }));

    const { error } = await supabase
      .from('user_progress') // Assegura't que aquesta taula existeix
      .upsert(progressInserts, { onConflict: 'user_id, challenge_id' });

    if (error) {
      console.error('Error saving progress:', error);
      throw new Error('Database error saving progress');
    }
  }

  async updateXp(userId: string, newTotalXp: number, newLevel: number): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ 
        total_xp: newTotalXp,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating XP:', error);
      throw new Error('Database error updating XP');
    }
  }
}