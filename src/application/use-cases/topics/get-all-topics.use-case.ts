// filepath: src/application/use-cases/topics/get-all-topics.use-case.ts
// CORRECCIÓ: Importem la interfície amb la "I"
import { ITopicRepository } from "@/core/repositories/topic.repository";
// CORRECCIÓ: Ruta plana, sense subdirectori 'topics/' si el fitxer està a l'arrel de entities
import { Topic } from "@/core/entities/topic.entity";

export class GetAllTopicsUseCase {
  // Injecció de dependència utilitzant la Interfície correcta
  constructor(private topicRepo: ITopicRepository) {}

  async execute(): Promise<Topic[]> {
    return await this.topicRepo.findAll();
  }
}