// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNextChallengeUseCase } from './get-next-challenge.use-case';
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { TopicNotFoundError } from '@/core/errors/topic.errors';
import { Topic } from '@/core/entities/topic.entity';
import { Challenge } from '@/core/entities/challenge.entity';

// 1. Definim els Mocks parcials de forma segura
// Utilitzem 'as unknown as ...' per dir-li a TS: "Això és un mock, confia en mi", sense usar 'any'.
const mockTopicRepo = {
  findBySlug: vi.fn(),
  // Afegim la resta de mètodes obligatoris de la interfície per evitar errors de tipat al constructor
  findAllActive: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
} as unknown as ITopicRepository;

const mockChallengeRepo = {
  findNextForUser: vi.fn(),
  // Mètodes obligatoris restants
  findByTopicId: vi.fn(),
  findById: vi.fn(),
} as unknown as IChallengeRepository;

describe('GetNextChallengeUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a challenge when topic exists', async () => {
    // ARRANGE
    // Creem objectes parcials però tipats de forma segura per al test
    const mockTopic = { 
      id: 'topic-123', 
      slug: 'react' 
    } as unknown as Topic;

    const mockChallenge = { 
      id: 'chal-1', 
      type: 'QUIZ' 
    } as unknown as Challenge;

    vi.mocked(mockTopicRepo.findBySlug).mockResolvedValue(mockTopic);
    vi.mocked(mockChallengeRepo.findNextForUser).mockResolvedValue(mockChallenge);

    const useCase = new GetNextChallengeUseCase(mockTopicRepo, mockChallengeRepo);

    // ACT
    const result = await useCase.execute('react', 'user-1');

    // ASSERT
    expect(mockTopicRepo.findBySlug).toHaveBeenCalledWith('react');
    expect(mockChallengeRepo.findNextForUser).toHaveBeenCalledWith('topic-123', 'user-1');
    expect(result).toEqual(mockChallenge);
  });

  it('should throw TopicNotFoundError if topic slug is invalid', async () => {
    // ARRANGE
    vi.mocked(mockTopicRepo.findBySlug).mockResolvedValue(null);
    const useCase = new GetNextChallengeUseCase(mockTopicRepo, mockChallengeRepo);

    // ACT & ASSERT
    // Verifiquem que llança l'error de domini correcte
    await expect(useCase.execute('invalid-slug', 'user-1'))
      .rejects
      .toThrow(TopicNotFoundError);
  });
});