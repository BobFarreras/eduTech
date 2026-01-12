// filepath: src/core/entities/challenges/definitions/binary.content.ts
export interface BinaryContent {
  // Ara acceptem string (legacy) o Record (multidioma)
  statement: string | Record<string, string>; 
  isTrue: boolean;
  explanation: string | Record<string, string>;
  variant?: 'HOT_OR_NOT' | 'TRUE_FALSE';
}