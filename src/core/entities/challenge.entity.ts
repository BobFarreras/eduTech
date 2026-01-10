// filepath: src/core/entities/challenge.entity.ts

// 1. Definim tots els tipus de joc que suportarà el sistema

export type ChallengeType = 'QUIZ' | 'CODE_FIX' | 'MATCHING' | 'TERMINAL' | 'LOGIC_ORDER';

// --- COMPONENTS REUTILITZABLES ---

export interface ChallengeOption {
  id: string;
  text: string;
}

// --- CONTINGUTS ESPECÍFICS PER A CADA JOC ---

export interface QuizContent {
  question: string;
  explanation: string;
  options: ChallengeOption[]; 
  correctOptionIndex: number;
}

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

export interface MatchingContent {
  instruction: string;
  pairs: { 
    left: ChallengeOption; 
    right: ChallengeOption 
  }[];
}

// ✅ NOU: Contingut per a TERMINAL
export interface TerminalContent {
  instruction: string;      // Ex: "Llista els fitxers inclosos els ocults"
  initialCommand?: string;  // Ex: "ls " (per ajudar)
  validCommands: string[];  // Ex: ["ls -la", "ls -a -l", "ls -al"]
  hint: string;             // Ex: "Usa el flag -a"
  explanation: string;      // Ex: "El flag -a mostra arxius que comencen per punt."
  outputParams: {
    success: string;        // Ex: ". .. .git .env app.ts"
    error: string;          // Ex: "command not found"
  };
}
// ✅ NOU: Contingut per a LOGIC_ORDER
export interface LogicOrderContent {
  description: string;    // Ex: "Ordena els passos per crear una imatge Docker"
  items: ChallengeOption[]; // Els items que arribaran DESORDENATS al client
  // Nota: No enviem l'ordre correcte aquí si volem ser 100% segurs (validació al server),
  // però per UX immediata sovint s'envia o es valida en una Server Action separada.
  // Per simplicitat en aquesta fase, assumirem que el 'Action' de validació té la solució.
}
// --- UNION TYPE (POLIMORFISME) ---
export type ChallengeContent = 
  | QuizContent 
  | CodeFixContent 
  | MatchingContent
  | TerminalContent // 👈 Afegit aquí
  | LogicOrderContent; // 👈 AFEGIT

// --- ENTITAT PRINCIPAL ---
export interface Challenge {
  id: string;
  topicId: string;
  difficultyTier: number;
  type: ChallengeType;
  content: ChallengeContent;
  createdAt: Date;
}

