// filepath: src/infrastructure/repositories/supabase/challenge.repository.ts
import { createClient } from '@/infrastructure/utils/supabase/server';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeType, QuizContent } from '@/core/entities/challenge.entity';

// --- TIPUS DE DADES (DATABASE TYPES) ---

type LocalizedString = Record<string, string>;

// 1. Format NOU (Multidioma)
type RawChallengeContent = {
  question: LocalizedString;
  explanation: LocalizedString;
  options: Array<{ id: string; text: LocalizedString }>;
  correctOptionIndex: number;
};
// 2. Format VELL (Strings simples) - Aquest és el que necessitem pel fallback
type LegacyRawContent = {
  question: string;
  explanation: string;
  options: string[]; // <--- Array d'strings simple
  correctOptionIndex: number;
};


// 3. Tipus de la fila SQL
type ChallengeRow = {
  id: string;
  topic_id: string;
  difficulty_tier: number;
  type: string;
  content: unknown; // Usem 'unknown' perquè pot ser qualsevol dels dos formats anteriors
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
    const rawData = row.content;

    let localizedContent: QuizContent;

    // --- DETECTION LOGIC (Type Guard) ---
    // Comprovem si és el format NOU (té opcions com a objectes)
    const isNewFormat =
      rawData &&
      typeof rawData === 'object' &&
      'options' in rawData &&
      Array.isArray((rawData as RawChallengeContent).options) &&
      (rawData as RawChallengeContent).options.length > 0 &&
      typeof (rawData as RawChallengeContent).options[0] === 'object';

    if (isNewFormat) {
      // --- FORMAT NOU (JSONB Multidioma) ---
      // Fem el cast segur perquè ja hem comprovat l'estructura
      const content = rawData as RawChallengeContent;

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
      // --- FORMAT VELL (Fallback) ---
      // 🛡️ CORRECCIÓ: Usem 'as unknown as LegacyRawContent' en lloc de 'any'
      // Això li diu a TS: "Confia en mi, si no és el format nou, tracta-ho com el vell"
      const content = rawData as unknown as LegacyRawContent;

      const oldOptions = Array.isArray(content.options) ? content.options : [];

      localizedContent = {
        question: String(content.question || ''),
        explanation: String(content.explanation || ''),
        correctOptionIndex: content.correctOptionIndex || 0,
        options: oldOptions.map((txt, idx) => ({
          id: `opt-${idx}`, // Generem un ID sintètic per mantenir consistència
          text: String(txt)
        }))
      };
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

  async findNextForUser(topicId: string, userId: string, locale: string): Promise<Challenge[]> {
    const supabase = await createClient();

    // 1. Obtenir completats
    const { data: completed } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', userId)
      .eq('topic_id', topicId);

    const completedIds = completed?.map(c => c.challenge_id) || [];

    // 2. Query Principal
    let query = supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId)
      .order('difficulty_tier', { ascending: true })
      .limit(5);

    if (completedIds.length > 0) {
      // Nota: Usem filter per la negació d'una llista
      query = query.filter('id', 'not.in', `(${completedIds.join(',')})`);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Error fetching challenges: ${error.message}`);
    if (!data) return [];

    return data.map(row => this.mapToEntity(row as ChallengeRow, locale));
  }

  // Aquests mètodes també necessiten locale ara, o un locale per defecte ('ca')
  async findByTopicId(topicId: string, locale: string = 'ca'): Promise<Challenge[]> {
    const supabase = await createClient(); // Instancia local

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('topic_id', topicId);

    if (error) throw new Error(error.message);

    return data.map((row) => this.mapToEntity(row as ChallengeRow, locale));
  }

  async findById(id: string, locale: string = 'ca'): Promise<Challenge | null> {
    const supabase = await createClient(); // Instancia local

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