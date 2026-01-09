// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNextChallengeUseCase } from './get-next-challenge.use-case';
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { TopicNotFoundError } from '@/core/errors/topic.errors';
import { Topic } from '@/core/entities/topic.entity';
import { Challenge } from '@/core/entities/challenge.entity';

const mockTopicRepo = {
  findBySlug: vi.fn(),
  findAllActive: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
} as unknown as ITopicRepository;

const mockChallengeRepo = {
  findNextForUser: vi.fn(), // Ara retorna Promise<Challenge[]>
  findByTopicId: vi.fn(),
  findById: vi.fn(),
} as unknown as IChallengeRepository;

describe('GetNextChallengeUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of challenges when topic exists', async () => {
    // ARRANGE
    const mockTopic = { 
      id: 'topic-123', 
      slug: 'react' 
    } as unknown as Topic;

    const mockChallenge = { 
      id: 'chal-1', 
      type: 'QUIZ' 
    } as unknown as Challenge;

    // CONFIGURACIÓ DEL MOCK:
    vi.mocked(mockTopicRepo.findBySlug).mockResolvedValue(mockTopic);
    
    // CORRECCIÓ AQUÍ: Retornem un Array [mockChallenge] enlloc de l'objecte sol
    vi.mocked(mockChallengeRepo.findNextForUser).mockResolvedValue([mockChallenge]);

    const useCase = new GetNextChallengeUseCase(mockTopicRepo, mockChallengeRepo);

    // ACT
    const result = await useCase.execute('react', 'user-1');

    // ASSERT
    expect(mockTopicRepo.findBySlug).toHaveBeenCalledWith('react');
    expect(mockChallengeRepo.findNextForUser).toHaveBeenCalledWith('topic-123', 'user-1');
    
    // CORRECCIÓ AQUÍ: Esperem rebre l'array
    expect(result).toEqual([mockChallenge]);
  });

  it('should throw TopicNotFoundError if topic slug is invalid', async () => {
    vi.mocked(mockTopicRepo.findBySlug).mockResolvedValue(null);
    const useCase = new GetNextChallengeUseCase(mockTopicRepo, mockChallengeRepo);

    await expect(useCase.execute('invalid-slug', 'user-1'))
      .rejects
      .toThrow(TopicNotFoundError);
  });
});