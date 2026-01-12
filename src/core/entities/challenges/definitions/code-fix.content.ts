// filepath: src/core/entities/challenges/definitions/code-fix.content.ts
export interface CodeFixOption {
  id: string;
  code: string;
  isCorrect: boolean;
}

export interface CodeFixContent {
  description: string;
  initialCode: string;
  solution: string;
  hint: string;
  tests: { input: string; output: string }[];
  options: CodeFixOption[];
}