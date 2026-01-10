// filepath: src/infrastructure/repositories/supabase/challenge.repository.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { parseJsonContent } from '@/infrastructure/mappers/mapper.utils';
import { ChallengeMapperFactory } from '@/infrastructure/mappers/challenge.mappers';

type ChallengeRow = {
  id: string;
  topic_id: string;
  difficulty_tier: number;
  type: string;
  content: unknown;
  created_at: string;
};

export class SupabaseChallengeRepository implements IChallengeRepository {

  // Aquesta funció ara és super neta gràcies al patró Strategy
  private mapToEntity(row: ChallengeRow, locale: string): Challenge {
    const rawData = parseJsonContent(row.content);
    const mapper = ChallengeMapperFactory.getMapper(row.type);
    
    // Deleguem la complexitat al mapper específic
    const localizedContent = mapper.map(rawData, locale);

    return {
      id: row.id,
      topicId: row.topic_id,
      difficultyTier: row.difficulty_tier,
      type: row.type as ChallengeType,
      content: localizedContent,
      createdAt: new Date(row.created_at),
    };
  }

  // --- PUBLIC METHODS (Iguals que abans, però més nets) ---

  async findNextForUser(topicId: string, userId: string, locale: string, difficulty: number): Promise<Challenge[]> {
    const supabase = await createClient();

    // 1. Obtenir IDs completats
    const { data: completed } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    const completedIds = completed?.map(c => c.challenge_id) || [];

    // 2. Buscar reptes no completats
    let query = supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId)
      .eq('difficulty_tier', difficulty);

    if (completedIds.length > 0) {
      query = query.filter('id', 'not.in', `(${completedIds.join(',')})`);
    }

    const { data: newChallenges } = await query.limit(10);

    if (newChallenges && newChallenges.length > 0) {
      return newChallenges.map(row => this.mapToEntity(row as ChallengeRow, locale));
    }

    // 3. Fallback: Mode Repàs
    const { data: reviewChallenges } = await supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId)
      .eq('difficulty_tier', difficulty)
      .limit(10);

    return (reviewChallenges || []).map(row => this.mapToEntity(row as ChallengeRow, locale));
  }

  async findByTopicId(topicId: string, locale: string = 'ca'): Promise<Challenge[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId);

    if (error) throw new Error(error.message);
    return data.map((row) => this.mapToEntity(row as ChallengeRow, locale));
  }

  async findById(id: string, locale: string = 'ca'): Promise<Challenge | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return this.mapToEntity(data as ChallengeRow, locale);
  }
}