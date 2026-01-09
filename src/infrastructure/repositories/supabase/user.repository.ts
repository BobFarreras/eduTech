// filepath: src/infrastructure/repositories/supabase/user.repository.ts
import { createClient } from '@supabase/supabase-js';
import { IUserRepository, UserProfile } from '@/core/repositories/user.repository';

export class SupabaseUserRepository implements IUserRepository {
  // Nota: En Next.js Server Actions, hauríem d'usar cookies() per auth real.
  // Aquí usem el client genèric perquè estem amb un usuari demo.
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async findById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id, total_xp, current_level')
      .eq('id', userId)
      .single();

    if (error) return null;

    return {
      id: data.id,
      totalXp: data.total_xp,
      level: data.current_level
    };
  }

  async saveProgress(userId: string, challengeIds: string[], topicId: string, xpPerChallenge: number): Promise<void> {
    // Mapegem els IDs a files per a la taula user_progress
    const records = challengeIds.map(challengeId => ({
      user_id: userId,
      challenge_id: challengeId,
      topic_id: topicId,
      xp_earned: xpPerChallenge
    }));

    // Usem 'upsert' amb 'ignoreDuplicates' per evitar errors si l'usuari repeteix el repte
    const { error } = await this.supabase
      .from('user_progress')
      .upsert(records, { onConflict: 'user_id,challenge_id', ignoreDuplicates: true });

    if (error) throw new Error(`Error saving progress: ${error.message}`);
  }

  async updateXp(userId: string, newXp: number, newLevel: number): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .update({ total_xp: newXp, current_level: newLevel })
      .eq('id', userId);

    if (error) throw new Error(`Error updating XP: ${error.message}`);
  }
}