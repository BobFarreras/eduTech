// filepath: src/application/use-cases/topics/get-active-topics.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { Topic } from '@/core/entities/topic.entity';

/**
 * Cas d'Ús: Obtenir el llistat de temes disponibles per als usuaris.
 * Només retorna els que tenen isActive: true.
 */
export class GetActiveTopicsUseCase {
  // Injectem la interfície, no la implementació de Supabase!
  constructor(private readonly topicRepository: ITopicRepository) {}

  async execute(): Promise<Topic[]> {
    return this.topicRepository.findAllActive();
  }
}