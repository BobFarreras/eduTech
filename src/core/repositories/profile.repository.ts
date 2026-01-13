// filepath: src/core/repositories/profile.repository.ts
import { UserProfile, EditableProfileFields } from "../entities/user-profile.entity";

export interface IProfileRepository {
  /**
   * Obté el perfil complet combinant dades d'Auth i de la taula Profiles.
   */
  getById(userId: string): Promise<UserProfile | null>;

  /**
   * Actualitza només els camps permesos.
   */
  update(userId: string, data: EditableProfileFields): Promise<void>;
}