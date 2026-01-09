// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge } from '@/core/entities/challenge.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';

export class GetNextChallengeUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly challengeRepository: IChallengeRepository
  ) {}

  // 1. Afegim 'locale' als arguments
  async execute(topicSlug: string, userId: string, locale: string): Promise<Challenge[]> {
    const topic = await this.topicRepository.findBySlug(topicSlug);

    if (!topic) {
      throw new TopicNotFoundError(topicSlug);
    }

    // 2. Passem 'locale' al repositori
    return this.challengeRepository.findNextForUser(topic.id, userId, locale);
  }
}