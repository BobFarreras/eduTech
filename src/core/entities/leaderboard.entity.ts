// filepath: src/core/entities/leaderboard.entity.ts

/**
 * Representa una fila en la taula de classificació.
 * Aquesta entitat és agnòstica de la base de dades.
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  level: number;
  
  /**
   * La posició al rànquing global.
   * Pot ser null si encara no s'ha calculat.
   */
  rank: number;

  /**
   * Opcional: URL de l'avatar si en tenim.
   * Si no, la UI haurà de generar un placeholder.
   */
  avatarUrl?: string;
  
  /**
   * Indica si és l'usuari actual que està consultant (per ressaltar-lo a la UI).
   */
  isCurrentUser: boolean;
}