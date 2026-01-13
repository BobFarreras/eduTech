// filepath: src/core/repositories/leaderboard.repository.ts
import { LeaderboardEntry } from "../entities/leaderboard.entity";

/**
 * Defineix les operacions necessàries per gestionar el rànquing.
 * Implementació real a: src/infrastructure/repositories
 */
export interface ILeaderboardRepository {
  /**
   * Obté els usuaris amb més puntuació.
   * @param limit Nombre màxim d'usuaris a recuperar (ex: 10, 50).
   * @param offset Per a paginació (opcional).
   */
  getTopGlobal(limit: number, offset?: number): Promise<LeaderboardEntry[]>;

  /**
   * Obté la posició i dades d'un usuari específic.
   * Útil per mostrar: "Ets el número 450 del món".
   */
  getUserRank(userId: string): Promise<LeaderboardEntry | null>;
  
  /**
   * (Opcional per a futures fases)
   * Obté el rànquing al voltant de l'usuari (ex: 2 per sobre, 2 per sota).
   */
  // getSurroundingRank(userId: string): Promise<LeaderboardEntry[]>;
}