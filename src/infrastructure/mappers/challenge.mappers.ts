// filepath: src/infrastructure/mappers/challenge.mappers.ts
import { ChallengeContent } from '@/core/entities/challenges/challenge.entity';
import { translate, LocalizedString } from './mapper.utils';

// --- DEFINICIONS DE DADES "RAW" (Així és com ve el JSON de BD) ---

interface RawOption {
  id: string;
  text: LocalizedString;
}

interface RawQuizContent {
  question: LocalizedString;
  explanation: LocalizedString;
  options: RawOption[];
  correctOptionIndex: number;
}
// 1. DEFINICIÓ RAW (Com ve de la BD)
interface RawLogicOrderContent {
  description: LocalizedString;
  items: Array<{ id: string; text: LocalizedString }>;
}
// Suport per a dades antigues (Legacy)
interface LegacyRawQuizContent {
  question?: string;
  explanation?: string;
  options?: string[];
  correctOptionIndex?: number;
}

interface RawMatchingContent {
  instruction: LocalizedString;
  pairs: Array<{
    left: { id: string; text: LocalizedString };
    right: { id: string; text: LocalizedString };
  }>;
}

interface RawCodeFixContent {
  description: LocalizedString;
  initialCode: string;
  solution: string;
  hint: LocalizedString;
  tests?: Array<{ input: string; output: string }>;
  options: Array<{
    id: string;
    code: string;
    isCorrect: boolean;
  }>;
}

interface RawTerminalContent {
  instruction: LocalizedString;
  initialCommand?: string;
  validCommands: string[];
  hint: LocalizedString;
  explanation: LocalizedString;
  outputParams: {
    success: string;
    error: string;
  };
}

// --- INTERFÍCIE D'ESTRATÈGIA ---
interface ContentMapperStrategy {
  // L'entrada és 'unknown' perquè ve de la BD/JSON. No assumim res fins a validar.
  map(rawData: unknown, locale: string): ChallengeContent;
}

// --- 1. QUIZ MAPPER ---
class QuizMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    // 1. Intentem tractar-lo com a format nou
    const content = rawData as Partial<RawQuizContent>;
    const legacyContent = rawData as Partial<LegacyRawQuizContent>;

    // Type Guard simple: Si té 'options' i és un array d'objectes -> Format Nou
    const isNewFormat = 
      content.options && 
      Array.isArray(content.options) && 
      content.options.length > 0 &&
      typeof content.options[0] === 'object';

    if (isNewFormat) {
      // Ara TypeScript sap que 'content' és compatible amb RawQuizContent en aquest bloc
      const validContent = content as RawQuizContent;
      
      return {
        question: translate(validContent.question, locale),
        explanation: translate(validContent.explanation, locale),
        correctOptionIndex: validContent.correctOptionIndex,
        options: validContent.options.map((opt) => ({
          id: opt.id,
          text: translate(opt.text, locale)
        }))
      };
    } else {
      // Legacy handling
      const opts = legacyContent.options || [];
      return {
        question: String(legacyContent.question || ''),
        explanation: String(legacyContent.explanation || ''),
        correctOptionIndex: legacyContent.correctOptionIndex || 0,
        options: Array.isArray(opts) ? opts.map((txt, idx) => ({
          id: `opt-${idx}`,
          text: String(txt)
        })) : []
      }; // No cal cast a 'any', ja retorna ChallengeContent (QuizContent)
    }
  }
}

// --- 2. MATCHING MAPPER ---
class MatchingMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as RawMatchingContent;

    return {
      instruction: translate(content.instruction, locale),
      pairs: Array.isArray(content.pairs)
        ? content.pairs.map((p) => ({
            left: { id: p.left.id, text: translate(p.left.text, locale) },
            right: { id: p.right.id, text: translate(p.right.text, locale) }
          }))
        : []
    };
  }
}

// --- 3. CODE FIX MAPPER ---
class CodeFixMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as RawCodeFixContent;

    return {
      description: translate(content.description, locale),
      initialCode: content.initialCode || '',
      solution: content.solution || '',
      hint: translate(content.hint, locale),
      tests: content.tests || [],
      options: Array.isArray(content.options) ? content.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        isCorrect: opt.isCorrect
      })) : []
    };
  }
}

// --- 4. TERMINAL MAPPER ---
class TerminalMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as RawTerminalContent;

    return {
      instruction: translate(content.instruction, locale),
      initialCommand: content.initialCommand || '',
      validCommands: Array.isArray(content.validCommands) ? content.validCommands : [],
      hint: translate(content.hint, locale),
      explanation: translate(content.explanation, locale),
      outputParams: {
        success: content.outputParams?.success || 'OK',
        error: content.outputParams?.error || 'Error'
      }
    };
  }
}


// 2. LOGIC ORDER MAPPER (NOU)
class LogicOrderMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as RawLogicOrderContent;

    return {
      description: translate(content.description, locale),
      items: Array.isArray(content.items)
        ? content.items.map(item => ({
            id: item.id,
            text: translate(item.text, locale)
          }))
        : []
    };
  }
}

// --- FACTORY ---
export const ChallengeMapperFactory = {
  getMapper(type: string): ContentMapperStrategy {
    switch (type) {
      case 'QUIZ': return new QuizMapper();
      case 'MATCHING': return new MatchingMapper();
      case 'CODE_FIX': return new CodeFixMapper();
      case 'TERMINAL': return new TerminalMapper();
      case 'LOGIC_ORDER': return new LogicOrderMapper();
      default:
        console.warn(`Unknown challenge type: ${type}. Fallback to Quiz.`);
        return new QuizMapper();
    }
  }
};