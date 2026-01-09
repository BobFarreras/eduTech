// filepath: src/infrastructure/repositories/supabase/challenge.repository.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeType, ChallengeContent } from '@/core/entities/challenge.entity';

// --- 1. DEFINICIÓ DE TIPUS DE LA BASE DE DADES (RAW JSON) ---

type LocalizedString = Record<string, string>;

// Estructura JSON per a MATCHING a la BD
type RawMatchingContent = {
  instruction: LocalizedString;
  pairs: Array<{
    left: { id: string; text: LocalizedString };
    right: { id: string; text: LocalizedString };
  }>;
};

// Estructura JSON per a CODE_FIX a la BD
type RawCodeFixContent = {
  description: LocalizedString;
  initialCode: string;
  solution: string;
  tests?: Array<{ input: string; output: string }>;
  hint: LocalizedString; // <--- NOU
  options: Array<{       // <--- NOU
    id: string;
    code: string;
    isCorrect: boolean
  }>;
};

// Estructura JSON per a QUIZ a la BD (Format Nou)
type RawQuizContent = {
  question: LocalizedString;
  explanation: LocalizedString;
  options: Array<{ id: string; text: LocalizedString }>;
  correctOptionIndex: number;
};

// Estructura JSON per a QUIZ a la BD (Legacy / Fallback)
type LegacyRawContent = {
  question?: string;
  explanation?: string;
  options?: string[];
  correctOptionIndex?: number;
};

// Tipus de la fila SQL (content és unknown fins que el validem)
type ChallengeRow = {
  id: string;
  topic_id: string;
  difficulty_tier: number;
  type: string;
  content: unknown;
  created_at: string;
};

export class SupabaseChallengeRepository implements IChallengeRepository {

  // --- PRIVATE HELPERS ---

  private translate(field: LocalizedString | string | unknown, locale: string): string {
    if (typeof field === 'string') return field;
    if (!field || typeof field !== 'object') return '';

    const localized = field as LocalizedString;
    return localized[locale] || localized['ca'] || localized['en'] || Object.values(localized)[0] || '';
  }

  private mapToEntity(row: ChallengeRow, locale: string): Challenge {
    const challengeType = row.type as ChallengeType;

    // 1. Processar el JSON (pot venir com string o objecte)
    let rawData = row.content;
    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(rawData);
      } catch (e) {
        console.error(`Error parsing JSON for challenge ${row.id}`, e);
        rawData = {};
      }
    }

    let localizedContent: ChallengeContent;

    // --- LOGICA POLIMÒRFICA STRICTA (SENSE ANY) ---
    switch (challengeType) {

      // CAS 1: MATCHING
      case 'MATCHING': {
        // Fem un cast al tipus RAW específic
        const content = rawData as RawMatchingContent;

        localizedContent = {
          instruction: this.translate(content.instruction, locale),
          pairs: Array.isArray(content.pairs)
            ? content.pairs.map(p => ({
              left: {
                id: p.left.id,
                text: this.translate(p.left.text, locale)
              },
              right: {
                id: p.right.id,
                text: this.translate(p.right.text, locale)
              }
            }))
            : []
        };
        break;
      }

      // CAS 2: CODE_FIX
      case 'CODE_FIX': {
        const content = rawData as RawCodeFixContent;

        localizedContent = {
          description: this.translate(content.description, locale),
          initialCode: content.initialCode || '',
          solution: content.solution || '',
          // ✅ Assignem la traducció a 'hint' (singular)
          hint: this.translate(content.hint, locale),
          tests: content.tests || [],
          options: Array.isArray(content.options) ? content.options.map(opt => ({
            id: opt.id,
            code: opt.code,
            isCorrect: opt.isCorrect
          })) : []
        };
        break;
      }

      // CAS 3: QUIZ
      case 'QUIZ':
      default: {
        // Type Guard per detectar format nou
        const quizObj = rawData as Partial<RawQuizContent>;
        const isNewFormat =
          quizObj &&
          'options' in quizObj &&
          Array.isArray(quizObj.options) &&
          quizObj.options.length > 0 &&
          typeof quizObj.options[0] === 'object';

        if (isNewFormat) {
          const content = rawData as RawQuizContent;
          localizedContent = {
            question: this.translate(content.question, locale),
            explanation: this.translate(content.explanation, locale),
            correctOptionIndex: content.correctOptionIndex,
            options: content.options.map(opt => ({
              id: opt.id,
              text: this.translate(opt.text, locale)
            }))
          };
        } else {
          // Legacy
          const content = rawData as LegacyRawContent;
          const oldOptions = Array.isArray(content.options) ? content.options : [];
          localizedContent = {
            question: String(content.question || ''),
            explanation: String(content.explanation || ''),
            correctOptionIndex: content.correctOptionIndex || 0,
            options: oldOptions.map((txt, idx) => ({
              id: `opt-${idx}`,
              text: String(txt)
            }))
          };
        }
        break;
      }
    }

    return {
      id: row.id,
      topicId: row.topic_id,
      difficultyTier: row.difficulty_tier,
      type: challengeType,
      content: localizedContent,
      createdAt: new Date(row.created_at),
    };
  }

  // --- PUBLIC METHODS ---

  async findNextForUser(topicId: string, userId: string, locale: string, difficulty: number): Promise<Challenge[]> {
    const supabase = await createClient();

    const { data: completed } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    const completedIds = completed?.map(c => c.challenge_id) || [];

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

    // Fallback Mode Repàs
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