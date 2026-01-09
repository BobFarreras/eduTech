// filepath: src/infrastructure/repositories/supabase/topic.repository.ts

import { ITopicRepository, TierProgressStats } from '@/core/repositories/topic.repository';
import { Topic, CreateTopicInput } from '@/core/entities/topic.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';
import { createClient } from '@/infrastructure/utils/supabase/server'; // El teu helper
import { ChallengeType } from '@/core/entities/challenge.entity';
// 1. Definim el tipus exacte de la fila a la BD (Lectura)
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

// 2. Definim el tipus per a Escriptura (Insert/Update)
type TopicPersistencePayload = {
  slug?: string;
  name_key?: string;
  icon_name?: string;
  color_theme?: string;
  parent_topic_id?: string | null;
  is_active?: boolean;
};

export class SupabaseTopicRepository implements ITopicRepository {

  // ❌ ESBORRAT: No podem tenir una propietat 'supabase' aquí perquè el client és async.
  // private supabase = ...

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
    // ✅ CORRECCIÓ: Instanciem el client DINS del mètode
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('is_active', true)
      .returns<TopicRow[]>();

    if (error) throw new Error(`Supabase Error: ${error.message}`);

    return data.map((row) => this.mapToEntity(row));
  }

  async findAll(): Promise<Topic[]> {
    const supabase = await createClient(); // ✅ Instancia local

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .returns<TopicRow[]>();

    if (error) throw new Error(error.message);
    return data.map((row) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Topic | null> {
    const supabase = await createClient(); // ✅ Instancia local

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single<TopicRow>();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    const supabase = await createClient(); // ✅ Instancia local

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('slug', slug)
      .single<TopicRow>();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async create(input: CreateTopicInput): Promise<Topic> {
    const supabase = await createClient(); // ✅ Instancia local

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
      .single<TopicRow>();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, input: Partial<CreateTopicInput>): Promise<Topic> {
    const supabase = await createClient(); // ✅ Instancia local

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
      .single<TopicRow>();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new TopicNotFoundError(id);
      }
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async getTopicProgressSummary(topicId: string, userId: string): Promise<TierProgressStats[]> {
    const supabase = await createClient();

    // 1. Obtenir reptes amb el seu TIPUS
    const { data: challenges, error: chalError } = await supabase
      .from('challenges')
      .select('id, difficulty_tier, type') // <--- AFEGIM 'type'
      .eq('topic_id', topicId);

    if (chalError) throw new Error(chalError.message);
    if (!challenges) return [];

    // 2. Obtenir el progrés de l'usuari en aquest tema
    const { data: progress, error: progError } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    if (progError) throw new Error(progError.message);

    // 3. Càlculs (Igual que abans)
    const completedSet = new Set(progress?.map(p => p.challenge_id));
   const statsMap = new Map<number, TierProgressStats>();

    challenges.forEach(c => {
      const tier = c.difficulty_tier;
      
      // ✅ CORRECCIÓ 3: Cast segur al nostre tipus (ChallengeType) en lloc de 'any'
      // Supabase retorna string, nosaltres li diem a TS que confiem que és un dels nostres tipus.
      const type = c.type as ChallengeType; 

      if (!statsMap.has(tier)) {
        statsMap.set(tier, {
          tier,
          totalChallenges: 0,
          completedChallenges: 0,
          mostCommonType: type // Usem la variable tipada
        });
      }
      const stat = statsMap.get(tier)!;
      stat.totalChallenges++;
      if (completedSet.has(c.id)) {
        stat.completedChallenges++;
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => a.tier - b.tier);
  }

  
}