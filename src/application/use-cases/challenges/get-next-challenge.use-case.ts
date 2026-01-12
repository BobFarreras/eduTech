// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';

export class GetNextChallengeUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly challengeRepository: IChallengeRepository
  ) {}

  // 1. AFEGIM 'difficulty' A LA SIGNATURA
  async execute(topicSlug: string, userId: string, locale: string, difficulty: number): Promise<Challenge[]> {
    const topic = await this.topicRepository.findBySlug(topicSlug);

    if (!topic) {
      throw new TopicNotFoundError(topicSlug);
    }

    // 2. PASSEM 'difficulty' AL REPOSITORI
    return this.challengeRepository.findNextForUser(topic.id, userId, locale, difficulty);
  }
}