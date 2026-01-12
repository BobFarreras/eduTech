// filepath: src/core/entities/challenges/definitions/theory.content.ts

// Tipus auxiliar per a textos multi-idioma
export type LocalizedText = { ca: string; es: string; en?: string };

// Blocs individuals
export interface BlockText {
  type: 'text';
  content: LocalizedText;
}

export interface BlockList {
  type: 'list';
  items: LocalizedText[];
}

export interface BlockCode {
  type: 'code';
  value: string;
  lang?: string;
}

export type TheoryBlock = BlockText | BlockList | BlockCode;

// El contingut principal
export interface TheoryContent {
  title: LocalizedText;
  blocks: TheoryBlock[];
}