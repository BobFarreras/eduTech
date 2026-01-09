// filepath: src/core/repositories/challenge.repository.ts
import { Challenge } from '../entities/challenge.entity';

export interface IChallengeRepository {
  /**
   * Obté el següent repte per a un usuari en un tema,
   * traduït a l'idioma especificat.
   */
  findNextForUser(topicId: string, userId: string, locale: string): Promise<Challenge[]>;
  
  // (Opcional) Si necessites aquests altres mètodes, també han de rebre locale
  findByTopicId(topicId: string, locale: string): Promise<Challenge[]>;
  findById(id: string, locale: string): Promise<Challenge | null>;
}