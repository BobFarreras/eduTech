// filepath: src/infrastructure/repositories/supabase/topic.repository.ts
import { ITopicRepository, TierProgressStats, MapConfig } from '@/core/repositories/topic.repository';
import { Topic, CreateTopicInput, LocalizedText } from '@/core/entities/topic.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';
import { createClient } from '@/infrastructure/utils/supabase/server';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { DashboardTopicDTO } from '@/application/dto/dashboard-topic.dto'; // ✅ 1. IMPORT AFEGIT

// --- TIPUS INTERNS PER A LA BASE DE DADES ---

type TopicRow = {
  id: string;
  slug: string;
  title: LocalizedText;
  icon_name: string;
  color_theme: string;
  parent_topic_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description?: LocalizedText | null;
};

// ✅ CANVI: Ara esperem un array d'objectes amb ID, no un count
type TopicWithChallengesRow = TopicRow & {
  challenges: { id: string }[];
};
// 1. ACTUALITZEM EL TIPUS (Afegim 'xp_earned')
type ProgressRow = {
  challenge_id: string;
  xp_earned: number; // <--- AFEGIT: Necessitem saber quants punts valia el repte
  challenges: {
    topic_id: string;
  } | null;
};

const EMPTY_LOCALIZED_TEXT: LocalizedText = { ca: '', es: '', en: '' };

type ChallengeRow = {
  id: string;
  difficulty_tier: number;
  type: string;
  map_config: MapConfig | null;
};

export class SupabaseTopicRepository implements ITopicRepository {

// Assegura't de copiar els altres mètodes si no els tens!
  private mapToEntity(row: TopicRow): Topic {
    return {
      id: row.id,
      slug: row.slug,
      iconName: row.icon_name,
      colorTheme: row.color_theme,
      parentTopicId: row.parent_topic_id || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      title: row.title,
      description: row.description || EMPTY_LOCALIZED_TEXT,
    };
  }
  
  async findAllActive(): Promise<Topic[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('topics').select('*').eq('is_active', true).order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return (data as TopicRow[]).map(r => this.mapToEntity(r));
  }

  async findAll(): Promise<Topic[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Could not fetch topics');
    return (data as TopicRow[]).map((row) => this.mapToEntity(row));
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
    const dbPayload = {
      slug: input.slug,
      icon_name: input.iconName,
      color_theme: input.colorTheme,
      parent_topic_id: input.parentTopicId || null,
      is_active: input.isActive,
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
    const dbPayload: Partial<TopicRow> = {};

    if (input.slug !== undefined) dbPayload.slug = input.slug;
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
      if (error.code === 'PGRST116') throw new TopicNotFoundError(id);
      throw new Error(error.message);
    }
    return this.mapToEntity(data as TopicRow);
  }

  async getTopicProgressSummary(topicId: string, userId: string): Promise<TierProgressStats[]> {
    const supabase = await createClient();
    const { data: rawChallenges, error: chalError } = await supabase
      .from('challenges')
      .select('id, difficulty_tier, type, map_config')
      .eq('topic_id', topicId);

    if (chalError) throw new Error(chalError.message);
    if (!rawChallenges || rawChallenges.length === 0) return [];

    const challenges = rawChallenges as unknown as ChallengeRow[];

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
          mostCommonType: type,
          mapConfig: null
        });
      }

      const stat = statsMap.get(tier)!;
      stat.totalChallenges++;

      if (c.map_config && !stat.mapConfig) {
        stat.mapConfig = c.map_config;
      }

      if (completedSet.has(c.id)) {
        stat.completedChallenges++;
      }
    }

    return Array.from(statsMap.values()).sort((a, b) => a.tier - b.tier);
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (error) throw new Error(`Error eliminant el topic: ${error.message}`);
  }

  // 👇👇👇 EL MÈTODE ARREGLAT 👇👇👇
  async getUserDashboard(userId: string): Promise<DashboardTopicDTO[]> {
    const supabase = await createClient();

    // 1. Query Topics: Canviem 'challenges(count)' per 'challenges(id)'
    // Això porta tots els IDs dels reptes associats al tema.
    const { data: topicsData, error } = await supabase
      .from('topics')
      .select(`
        *,
        challenges(id)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    // 2. Query Progrés
    const { data: progressData, error: progError } = await supabase
      .from('user_progress')
      .select('challenge_id, xp_earned, challenges!inner(topic_id)')
      .eq('user_id', userId);

    if (progError) throw new Error(progError.message);

    // Casts
    const topics = topicsData as unknown as TopicWithChallengesRow[];
    const progress = progressData as unknown as ProgressRow[];

    // DEBUG: Veurem si 'topics' realment té reptes
    console.log("🔍 DEBUG TOPICS:", topics.map(t => ({ slug: t.slug, total_reptes: t.challenges?.length })));

    // 3. Mapeig
    return topics.map((topic) => {
      // ✅ CÀLCUL ROBUST: Comptem la longitud de l'array
      const totalChallenges = topic.challenges?.length || 0;

      const topicProgress = progress.filter(p => p.challenges?.topic_id === topic.id);
      const completedCount = topicProgress.length;
      const totalXp = topicProgress.reduce((sum, p) => sum + (p.xp_earned || 0), 0);

      let percentage = 0;
      if (totalChallenges > 0) {
        percentage = Math.round((completedCount / totalChallenges) * 100);
      }
      
      // Evitem percentatges > 100% per si de cas
      if (percentage > 100) percentage = 100;

      const currentLevel = Math.floor(totalXp / 100) + 1;

      return {
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        description: topic.description || EMPTY_LOCALIZED_TEXT,
        iconName: topic.icon_name,
        colorTheme: topic.color_theme,
        isActive: topic.is_active,
        createdAt: new Date(topic.created_at),
        updatedAt: new Date(topic.updated_at),
        
        progressPercentage: percentage,
        currentLevel: currentLevel,
        isLocked: false,
        totalXpEarned: totalXp
      };
    });
  }
}