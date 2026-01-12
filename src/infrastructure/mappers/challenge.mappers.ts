// filepath: src/infrastructure/mappers/challenge.mappers.ts
import { ChallengeContent } from '@/core/entities/challenges/challenge.entity';
import { translate, LocalizedString } from './mapper.utils';
// IMPORTA ELS TIPUS ESPECÍFICS DE TEORIA
import {
  TheoryContent,
  TheoryBlock,
  LocalizedText
} from '@/core/entities/challenges/definitions/theory.content';
import { CtfContent, VirtualFile } from '@/core/entities/challenges/definitions/ctf.content';

// --- DEFINICIONS DE DADES "RAW" (JSON de la BD) ---
// --- HELPER DE CONVERSIÓ ---
// Transforma el tipus "Raw" (que pot ser qualsevol cosa) al tipus "Domain" (Estricte)
function toDomainText(raw: LocalizedString | undefined): LocalizedText {
  // Forcem un cast a Record per accedir a les claus de manera segura
  const r = (raw || {}) as Record<string, string>;
  return {
    ca: r.ca || '', // Assegurem que sempre hi ha string
    es: r.es || '',
    en: r.en // Opcional
  };
}
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

interface RawLogicOrderContent {
  description: LocalizedString;
  items: Array<{ id: string; text: LocalizedString }>;
}

interface RawBinaryContent {
  statement: LocalizedString;
  isTrue: boolean;
  explanation: LocalizedString;
  variant?: 'HOT_OR_NOT' | 'TRUE_FALSE';
}

// Actualitza la interfície RawTheoryBlock per usar LocalizedString (com ve de la BD/Utils)
interface RawTheoryBlock {
  type: 'text' | 'list' | 'code';
  content?: LocalizedString;
  items?: LocalizedString[];
  value?: string;
  lang?: string;
}

interface RawTheoryContent {
  title: LocalizedString;
  blocks: RawTheoryBlock[];
}

// --- INTERFÍCIE D'ESTRATÈGIA ---
interface ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent;
}
// 1. DEFINIR LES INTERFÍCIES "RAW" (El que ve del JSON de la BD)
interface RawCtfCommand {
  commandRegex: string;
  output: string;
  unlocksFile?: string;
  unlocksFlag?: string;
}

interface RawCtfFlag {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  secret: string;
  points?: number;
}

interface RawCtfContent {
  missionTitle: LocalizedString;
  missionBriefing: LocalizedString;
  initialFileSystem: VirtualFile[];
  validCommands: RawCtfCommand[]; // 👈 Ja no és any[]
  flags: RawCtfFlag[];            // 👈 Ja no és any[]
}
// --- MAPPERS EXISTENTS ---

class QuizMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as Partial<RawQuizContent>;
    const legacyContent = rawData as Partial<LegacyRawQuizContent>;

    const isNewFormat =
      content.options &&
      Array.isArray(content.options) &&
      content.options.length > 0 &&
      typeof content.options[0] === 'object';

    if (isNewFormat) {
      const validContent = content as RawQuizContent;
      return {
        question: translate(validContent.question, locale),
        explanation: translate(validContent.explanation, locale),
        correctOptionIndex: validContent.correctOptionIndex || 0,
        options: validContent.options.map((opt) => ({
          id: opt.id,
          text: translate(opt.text, locale)
        }))
      };
    } else {
      const opts = legacyContent.options || [];
      return {
        question: String(legacyContent.question || ''),
        explanation: String(legacyContent.explanation || ''),
        correctOptionIndex: legacyContent.correctOptionIndex || 0,
        options: Array.isArray(opts) ? opts.map((txt, idx) => ({
          id: `opt-${idx}`,
          text: String(txt)
        })) : []
      };
    }
  }
}

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

class BinaryMapper implements ContentMapperStrategy {
  map(rawData: unknown, locale: string): ChallengeContent {
    const content = rawData as RawBinaryContent;
    return {
      statement: translate(content.statement, locale),
      explanation: translate(content.explanation, locale),
      isTrue: content.isTrue,
      variant: content.variant || 'TRUE_FALSE'
    };
  }
}

// ✅ 2. NOU MAPPER PER A THEORY (CORREGIT)
class TheoryMapper implements ContentMapperStrategy {
  // FIX 1: Usem '_locale' per indicar que no el fem servir aquí (evita l'error eslint)
  map(rawData: unknown, _locale: string): ChallengeContent {
    const content = rawData as RawTheoryContent;

    // Mapegem els blocs convertint 'LocalizedString' -> 'LocalizedText'
    const blocks: TheoryBlock[] = Array.isArray(content.blocks)
      ? content.blocks.map((block): TheoryBlock => {

        if (block.type === 'text') {
          return {
            type: 'text',
            // FIX 2: Usem la funció auxiliar per convertir tipus
            content: toDomainText(block.content)
          };
        }

        if (block.type === 'list') {
          return {
            type: 'list',
            // FIX 2: Mapegem l'array d'items
            items: (block.items || []).map(toDomainText)
          };
        }

        if (block.type === 'code') {
          return {
            type: 'code',
            value: block.value || '',
            lang: block.lang
          };
        }

        // Fallback segur
        return { type: 'text', content: { ca: '', es: '' } };
      })
      : [];

    return {
      title: toDomainText(content.title),
      blocks: blocks
    } as TheoryContent;
  }
}
// 2. MAPPER TIPAT
class CtfMapper implements ContentMapperStrategy {
  map(rawData: unknown, _locale: string): ChallengeContent {
    const content = rawData as RawCtfContent;

    return {
      missionTitle: toDomainText(content.missionTitle),
      missionBriefing: toDomainText(content.missionBriefing),
      initialFileSystem: content.initialFileSystem || [],
      
      // Ara TS sap que 'cmd' és un RawCtfCommand
      validCommands: Array.isArray(content.validCommands) ? content.validCommands : [],
      
      // Ara TS sap que 'f' és un RawCtfFlag
      flags: Array.isArray(content.flags) ? content.flags.map((f) => ({
        id: f.id,
        name: toDomainText(f.name),
        description: toDomainText(f.description),
        secret: f.secret,
        points: f.points || 10
      })) : []
    } as CtfContent;
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
      case 'BINARY_DECISION': return new BinaryMapper();

      // ✅ 3. REGISTREM EL NOU TIPUS
      case 'THEORY': return new TheoryMapper();
      case 'CTF': return new CtfMapper();


      default:
        console.warn(`Unknown challenge type: ${type}. Fallback to Quiz.`);
        return new QuizMapper();
    }
  }
};