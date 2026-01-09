// filepath: src/core/repositories/challenge.repository.ts
import { Challenge } from '../entities/challenge.entity';

export interface IChallengeRepository {
  /**
   * Cerca reptes associats a un tema específic.
   */
  findByTopicId(topicId: string): Promise<Challenge[]>;

  /**
   * Obté un repte concret per ID (per validar la resposta).
   */
  findById(id: string): Promise<Challenge | null>;

  /**
   * Mètode intel·ligent: Obté el següent repte per a un usuari en un tema.
   * (Més endavant filtrarà els que l'usuari ja ha completat).
   * Per ara, pot retornar el primer disponible.
   */
  findNextForUser(topicId: string, userId: string): Promise<Challenge[]>;

}