// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge } from '@/core/entities/challenge.entity'; // Assegura't que s'importa
import { TopicNotFoundError } from '@/core/errors/topic.errors';

export class GetNextChallengeUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly challengeRepository: IChallengeRepository
  ) {}

  // CORRECCIÓ AQUÍ: Retorna Challenge[] (Array)
  async execute(topicSlug: string, userId: string): Promise<Challenge[]> {
    const topic = await this.topicRepository.findBySlug(topicSlug);

    if (!topic) {
      throw new TopicNotFoundError(topicSlug);
    }

    // Aquest mètode del repositori ja l'havies actualitzat abans per retornar array?
    // Si no, comprova que el repositori també retorni Promise<Challenge[]>
    return this.challengeRepository.findNextForUser(topic.id, userId);
  }
}