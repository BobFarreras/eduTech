// filepath: src/infrastructure/repositories/supabase/topic.repository.ts
import { ITopicRepository, TierProgressStats } from '@/core/repositories/topic.repository';
import { Topic, CreateTopicInput } from '@/core/entities/topic.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';
import { createClient } from '@/infrastructure/utils/supabase/server';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';

// Tipus intern de la BD (Snake Case)
type TopicRow = {
  id: string;
  slug: string;
  name_key: string;
  icon_name: string;
  color_theme: string;
  parent_topic_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
};

type TopicPersistencePayload = {
  slug?: string;
  name_key?: string;
  icon_name?: string;
  color_theme?: string;
  parent_topic_id?: string | null;
  is_active?: boolean;
};

export class SupabaseTopicRepository implements ITopicRepository {

  // Aquest mètode és la clau per evitar duplicar lògica de mapeig
  private mapToEntity(row: TopicRow): Topic {
    return {
      id: row.id,
      slug: row.slug,
      nameKey: row.name_key,
      iconName: row.icon_name,
      colorTheme: row.color_theme,
      parentTopicId: row.parent_topic_id || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      description: row.description || ''
    };
  }

  async findAllActive(): Promise<Topic[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Supabase Error: ${error.message}`);

    const rows = data as TopicRow[];
    return rows.map((row) => this.mapToEntity(row));
  }

  // CORRECCIÓ PRINCIPAL AQUÍ:
  async findAll(): Promise<Topic[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      // Ordenem per clau de nom per defecte
      .order('name_key', { ascending: true }); 

    if (error) {
      console.error('Error fetching topics:', error);
      throw new Error('Could not fetch topics');
    }

    // Convertim les dades crues al tipus TopicRow
    const rows = data as TopicRow[];

    // Usem el mètode centralitzat per convertir a Entitat de Domini
    // Això garanteix que camps com 'nameKey', 'iconName' i 'isActive' existeixin.
    return rows.map((row) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Topic | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data as TopicRow);
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data as TopicRow);
  }

  async create(input: CreateTopicInput): Promise<Topic> {
    const supabase = await createClient();

    const dbPayload: TopicPersistencePayload = {
      slug: input.slug,
      name_key: input.nameKey,
      icon_name: input.iconName,
      color_theme: input.colorTheme,
      parent_topic_id: input.parentTopicId || null,
      is_active: input.isActive
    };

    const { data, error } = await supabase
      .from('topics')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data as TopicRow);
  }

  async update(id: string, input: Partial<CreateTopicInput>): Promise<Topic> {
    const supabase = await createClient();

    const dbPayload: TopicPersistencePayload = {};

    if (input.slug !== undefined) dbPayload.slug = input.slug;
    if (input.nameKey !== undefined) dbPayload.name_key = input.nameKey;
    if (input.iconName !== undefined) dbPayload.icon_name = input.iconName;
    if (input.colorTheme !== undefined) dbPayload.color_theme = input.colorTheme;
    if (input.isActive !== undefined) dbPayload.is_active = input.isActive;
    if (input.parentTopicId !== undefined) dbPayload.parent_topic_id = input.parentTopicId;

    const { data, error } = await supabase
      .from('topics')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new TopicNotFoundError(id);
      }
      throw new Error(error.message);
    }

    return this.mapToEntity(data as TopicRow);
  }

  async getTopicProgressSummary(topicId: string, userId: string): Promise<TierProgressStats[]> {
    const supabase = await createClient();

    const { data: challenges, error: chalError } = await supabase
      .from('challenges')
      .select('id, difficulty_tier, type')
      .eq('topic_id', topicId);

    if (chalError) throw new Error(chalError.message);
    if (!challenges || challenges.length === 0) return [];

    const { data: progress, error: progError } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    if (progError) throw new Error(progError.message);

    const completedSet = new Set(progress?.map(p => p.challenge_id));
    const statsMap = new Map<number, TierProgressStats>();

    for (const c of challenges) {
      const tier = c.difficulty_tier;
      const type = c.type as ChallengeType;

      if (!statsMap.has(tier)) {
        statsMap.set(tier, {
          tier,
          totalChallenges: 0,
          completedChallenges: 0,
          mostCommonType: type
        });
      }

      const stat = statsMap.get(tier)!;
      stat.totalChallenges++;

      if (completedSet.has(c.id)) {
        stat.completedChallenges++;
      }
    }

    return Array.from(statsMap.values()).sort((a, b) => a.tier - b.tier);
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminant el topic: ${error.message}`);
    }
  }
}