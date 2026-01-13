// filepath: src/infrastructure/repositories/supabase-leaderboard.repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { ILeaderboardRepository } from '@/core/repositories/leaderboard.repository';
import { LeaderboardEntry } from '@/core/entities/leaderboard.entity';

export class SupabaseLeaderboardRepository implements ILeaderboardRepository {
  // Injectem el client per suportar tant Server Components com Server Actions
  constructor(private supabase: SupabaseClient) {}

  async getTopGlobal(limit: number, offset: number = 0): Promise<LeaderboardEntry[]> {
    // 1. Consulta optimitzada a Profiles
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id, username, total_xp, current_level')
      .order('total_xp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Error al carregar el rànquing.');
    }

    if (!data) return [];

    // 2. Obtenir l'ID de l'usuari actual (per marcar isCurrentUser)
    const { data: { user } } = await this.supabase.auth.getUser();
    const currentUserId = user?.id;

    // 3. Mapeig (Mapping) a l'Entitat de Domini
    return data.map((row, index) => ({
      userId: row.id,
      username: row.username || 'Anonymous User', // Fallback de seguretat
      xp: row.total_xp,
      level: row.current_level,
      // El rànquing és l'offset + índex (base 1)
      rank: offset + index + 1,
      isCurrentUser: row.id === currentUserId,
      avatarUrl: undefined // Implementar si tenim bucket d'avatars
    }));
  }

  async getUserRank(userId: string): Promise<LeaderboardEntry | null> {
    // A. Primer obtenim les dades de l'usuari
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('id, username, total_xp, current_level')
      .eq('id', userId)
      .single();

    if (error || !profile) return null;

    // B. Calculem la posició (Rànquing)
    // "Quants usuaris tenen més XP que jo?"
    const { count, error: countError } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }) // head: true no baixa dades, només compta
      .gt('total_xp', profile.total_xp);

    if (countError) throw new Error('Error calculant la posició.');

    const rankPosition = (count || 0) + 1;

    // C. Retornem l'entitat completa
    return {
      userId: profile.id,
      username: profile.username || 'Anonymous',
      xp: profile.total_xp,
      level: profile.current_level,
      rank: rankPosition,
      isCurrentUser: true
    };
  }
}