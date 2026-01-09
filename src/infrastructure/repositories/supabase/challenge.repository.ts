// filepath: src/infrastructure/repositories/supabase/challenge.repository.ts
import { createClient } from '@supabase/supabase-js';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeContent, ChallengeType } from '@/core/entities/challenge.entity';

// Tipus "Raw" de la BD (tal com ve de Supabase)
type ChallengeRow = {
  id: string;
  topic_id: string;
  difficulty_tier: number;
  type: string; // Ve com a string, l'hem de castejar
  content: unknown; // El JSONB és unknown d'entrada
  created_at: string;
};

export class SupabaseChallengeRepository implements IChallengeRepository {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /**
   * Mapejador segur que valida el JSONB
   */
  private mapToEntity(row: ChallengeRow): Challenge {
    // 1. Validem el tipus d'Enum
    const challengeType = row.type as ChallengeType;

    // 2. Validem el contingut del JSON (Runtime check bàsic)
    // En un entorn més avançat usariem Zod aquí per validar l'esquema del JSON
    const content = row.content as ChallengeContent;

    if (!content) {
      throw new Error(`El repte ${row.id} té un contingut invàlid o buit.`);
    }

    return {
      id: row.id,
      topicId: row.topic_id,
      difficultyTier: row.difficulty_tier,
      type: challengeType,
      content: content,
      createdAt: new Date(row.created_at),
    };
  }

  async findByTopicId(topicId: string): Promise<Challenge[]> {
    const { data, error } = await this.supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId)
      .returns<ChallengeRow[]>();

    if (error) throw new Error(error.message);

    return data.map((row) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single<ChallengeRow>();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }
  // DINS DE LA CLASSE:
  async findNextForUser(topicId: string, userId: string): Promise<Challenge[]> { // <--- Ara retorna Array
    const { data, error } = await this.supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId)
      .order('difficulty_tier', { ascending: true })
      .limit(5); // <--- Agafem un "Batch" de 5 reptes per a la sessió

    if (error) throw new Error(error.message);

    // Mapegem TOTS els resultats
    return data.map(row => this.mapToEntity(row));
  }

}