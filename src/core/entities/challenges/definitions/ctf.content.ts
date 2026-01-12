// filepath: src/core/entities/challenges/definitions/ctf.content.ts
import { LocalizedText } from './theory.content';

// Una "Flag" és un objectiu que l'usuari ha de trobar
export interface CtfFlag {
  id: string;
  name: LocalizedText;       // Ex: "Accés a la BD"
  description: LocalizedText; // Ex: "Troba la contrasenya de l'admin"
  secret: string;            // El text que han de trobar (ex: "flag{sql_master}")
  points: number;            // Punts per trobar-la
}

// Un fitxer virtual en el sistema
export interface VirtualFile {
  name: string;
  content: string; // Contingut del fitxer (ex: notes.txt)
  isLocked?: boolean; // Si necessita permisos per llegir-se
}

export interface CtfContent {
  missionTitle: LocalizedText;
  missionBriefing: LocalizedText; // La història introductòria
  
  // L'estat inicial de la màquina virtual
  initialFileSystem: VirtualFile[];
  
  // Les comandes vàlides que fan avançar la història
  validCommands: {
    commandRegex: string; // Ex: "^nmap .*"
    output: string;       // El que respon la terminal
    unlocksFile?: string; // Si aquesta comanda crea/revela un fitxer
    unlocksFlag?: string; // Si aquesta comanda descobreix una flag automàticament
  }[];

  flags: CtfFlag[];
}