// filepath: src/core/repositories/challenge.repository.ts
import { Challenge } from '../entities/challenges/challenge.entity';

// Definim DTOs derivats de l'entitat per no repetir codi
export type CreateChallengeInput = Omit<Challenge, 'id' | 'createdAt'>;
export type UpdateChallengeInput = Partial<Omit<Challenge, 'id' | 'createdAt'>>;

export interface IChallengeRepository {
  // --- LECTURA (GAME LOOP) ---
  /**
   * Obté el següent repte per a un usuari en un tema,
   * traduït a l'idioma especificat.
   */
  findNextForUser(topicId: string, userId: string, locale: string, difficulty: number): Promise<Challenge[]>;

  findByTopicId(topicId: string, locale: string): Promise<Challenge[]>;
  findById(id: string, locale: string): Promise<Challenge | null>;

  // --- ESCRIPTURA (ADMIN - CMS) ---
  // Nota: Retornem l'Entitat creada/actualitzada. 
  // Acceptem un locale opcional per al retorn (per defecte 'ca'), 
  // encara que al CMS solem treballar amb dades "raw" o l'idioma base.
  
  create(data: CreateChallengeInput): Promise<Challenge>;
  update(id: string, data: UpdateChallengeInput): Promise<Challenge>;
  delete(id: string): Promise<void>;
}