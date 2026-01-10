// filepath: src/core/entities/challenges/definitions/terminal.content.ts
export interface TerminalContent {
  instruction: string;      
  initialCommand?: string;  
  validCommands: string[];  
  hint: string;             
  explanation: string;      
  outputParams: {
    success: string;        
    error: string;          
  };
}