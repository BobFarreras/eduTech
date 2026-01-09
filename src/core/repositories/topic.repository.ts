// filepath: src/core/repositories/topic.repository.ts
import { Topic, CreateTopicInput } from '../entities/topic.entity';

/**
 * Contracte que qualsevol adaptador de persistència (Infrastructure) ha de complir.
 * Retorna Promises perquè l'I/O és asíncron, però retorna entitats de Domini.
 */
export interface ITopicRepository {
  /**
   * Obté tots els temes actius.
   */
  findAllActive(): Promise<Topic[]>;

  /**
   * Obté tots els temes (inclosos els inactius) - Útil per a Admin.
   */
  findAll(): Promise<Topic[]>;

  /**
   * Cerca un tema pel seu ID.
   * @returns El tema o null si no existeix.
   */
  findById(id: string): Promise<Topic | null>;

  /**
   * Cerca un tema pel seu slug (per a rutes públiques).
   * @returns El tema o null si no existeix.
   */
  findBySlug(slug: string): Promise<Topic | null>;

  /**
   * Crea un nou tema.
   */
  create(topic: CreateTopicInput): Promise<Topic>;
  
  /**
   * Actualitza un tema existent.
   */
  update(id: string, topic: Partial<CreateTopicInput>): Promise<Topic>;
}