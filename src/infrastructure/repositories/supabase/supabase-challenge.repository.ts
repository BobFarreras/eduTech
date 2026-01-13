// filepath: src/infrastructure/repositories/supabase/challenge.repository.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IChallengeRepository, CreateChallengeInput, UpdateChallengeInput } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { parseJsonContent } from '@/infrastructure/mappers/mapper.utils';
import { ChallengeMapperFactory } from '@/infrastructure/mappers/challenge.mappers';

// Tipus intern per al insert/update de Supabase
type ChallengePersistencePayload = {
  topic_id?: string;
  difficulty_tier?: number;
  type?: string;
  content?: unknown; // JSONB
};

type ChallengeRow = {
  id: string;
  topic_id: string;
  difficulty_tier: number;
  type: string;
  content: unknown;
  created_at: string;
};
// 1. DTO de Retorn (El que la UI espera)
export interface AdminChallengeSummary {
  id: string;
  difficultyTier: number;
  type: string;
  createdAt: string;
  topicSlug: string;
}
// 1. DEFINICIÓ STRICTA DE LA RESPOSTA DE SUPABASE
// Aquesta interfície reflecteix exactament els camps que demanes al .select()
interface ChallengeWithTopicResponse {
  id: string;
  difficulty_tier: number;
  type: string;
  created_at: string;
  // Com que és un JOIN (!inner), Supabase retorna un objecte per a la relació 'topics'
  topics: {
    id: string;
    slug: string;
  } | null; // Pot ser null si falla la relació, encara que !inner ho força.
}

export interface PaginatedChallenges {
  data: AdminChallengeSummary[];
  total: number;
  totalPages: number;
}
export class SupabaseChallengeRepository implements IChallengeRepository {

  // Aquesta funció ara és super neta gràcies al patró Strategy
  private mapToEntity(row: ChallengeRow, locale: string): Challenge {
    const rawData = parseJsonContent(row.content);
    // Usem el mapper per assegurar que el JSON de la BD compleix l'estructura del Domini
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

  // --- PUBLIC METHODS: LECTURA (GAME) ---

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
      // Nota: filter amb not.in espera una llista formatada per a PostgREST
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



  // --- PUBLIC METHODS: ESCRIPTURA (ADMIN) ---

  async create(data: CreateChallengeInput): Promise<Challenge> {
    const supabase = await createClient();

    const payload: ChallengePersistencePayload = {
      topic_id: data.topicId,
      difficulty_tier: data.difficultyTier,
      type: data.type,
      // Supabase converteix l'objecte JS a JSONB automàticament
      content: data.content
    };

    const { data: created, error } = await supabase
      .from('challenges')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`Error creant repte: ${error.message}`);

    // Retornem l'entitat mapejada (per defecte en 'ca' ja que acabem de crear-la)
    return this.mapToEntity(created as ChallengeRow, 'ca');
  }

  async update(id: string, data: UpdateChallengeInput): Promise<Challenge> {
    const supabase = await createClient();

    const payload: ChallengePersistencePayload = {};
    if (data.topicId) payload.topic_id = data.topicId;
    if (data.difficultyTier) payload.difficulty_tier = data.difficultyTier;
    if (data.type) payload.type = data.type;
    if (data.content) payload.content = data.content;

    const { data: updated, error } = await supabase
      .from('challenges')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error actualitzant repte: ${error.message}`);

    return this.mapToEntity(updated as ChallengeRow, 'ca');
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Error eliminant repte: ${error.message}`);
  }

 /**
   * Obté reptes paginats amb doble filtre (Topic i Type)
   */
  async findAllPaginated(
    page: number = 1,
    pageSize: number = 10,
    topicFilter?: string,
    typeFilter?: string // <--- NOU PARÀMETRE
  ): Promise<PaginatedChallenges> {
    const supabase = await createClient();

    // 1. Query Base
    let query = supabase
      .from('challenges')
      .select(`
        id, difficulty_tier, type, created_at,
        topics!inner ( id, slug )
      `, { count: 'exact' });

    // 2. Filtre per TEMA
    if (topicFilter && topicFilter !== 'ALL') {
      query = query.eq('topic_id', topicFilter);
    }

    // 3. Filtre per TIPUS (NOU)
    if (typeFilter && typeFilter !== 'ALL') {
      query = query.eq('type', typeFilter);
    }

    // 4. Paginació
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    // 5. Mapeig (Recorda usar la interfície ChallengeWithTopicResponse que vam definir abans)
    const rawData = data as unknown as ChallengeWithTopicResponse[]; // O la interfície estricta si la tens importada

    const safeData = rawData.map((row) => ({
      id: row.id,
      difficultyTier: row.difficulty_tier,
      type: row.type,
      createdAt: row.created_at,
      topicSlug: row.topics?.slug ?? 'unknown'
    }));

    return {
      data: safeData,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  }

  /**
   * NECESSARI PER A L'EDICIÓ
   */
  async findById(id: string, locale: string = 'ca'): Promise<Challenge | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('challenges')
      .select('*') // Agafem tot el contingut (JSON inclòs)
      .eq('id', id)
      .single();

    if (error) return null;
    
    // Mapeig manual al Domini
    return {
      id: data.id,
      topicId: data.topic_id,
      difficultyTier: data.difficulty_tier,
      type: data.type,
      content: data.content, // El JSONB directe
      createdAt: new Date(data.created_at)
    };
  }
  /**
   * Retorna l'ID del repte anterior i següent per a la navegació.
   * Ordenació per created_at DESC (mateix ordre que el llistat).
   */
  async findAdjacentChallenges(currentId: string, currentCreatedAt: string): Promise<{ prevId: string | null; nextId: string | null }> {
    const supabase = await createClient();

    // 1. Buscar el PREVIOUS (Més nou que l'actual)
    // Ordenem ASC per agafar el "primer" que sigui més gran que l'actual
    const { data: prev } = await supabase
      .from('challenges')
      .select('id')
      .gt('created_at', currentCreatedAt)
      .order('created_at', { ascending: true }) // El més proper per dalt
      .limit(1)
      .single();

    // 2. Buscar el NEXT (Més vell que l'actual)
    // Ordenem DESC per agafar el "primer" que sigui més petit que l'actual
    const { data: next } = await supabase
      .from('challenges')
      .select('id')
      .lt('created_at', currentCreatedAt)
      .order('created_at', { ascending: false }) // El més proper per baix
      .limit(1)
      .single();

    return {
      prevId: prev?.id || null,
      nextId: next?.id || null
    };
  }

}