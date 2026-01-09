// filepath: src/application/use-cases/challenges/get-next-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNextChallengeUseCase } from './get-next-challenge.use-case';
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';
import { Challenge, ChallengeType, QuizContent } from '@/core/entities/challenge.entity';
import { Topic } from '@/core/entities/topic.entity';

// Mocks
const mockTopicRepo = {
  findBySlug: vi.fn(),
} as unknown as ITopicRepository;

const mockChallengeRepo = {
  findNextForUser: vi.fn(),
} as unknown as IChallengeRepository;

describe('GetNextChallengeUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return challenges translated to the requested locale', async () => {
    // ARRANGE
    const locale = 'en';
    const topicSlug = 'react-basics';
    const userId = 'user-123';
    const topicId = 'topic-abc';

    // 1. Simulem que trobem el tema (AMB LA NOVA ESTRUCTURA CORRECTA)
    const mockTopic: Topic = {
      id: topicId,
      slug: topicSlug,
      // CORRECCIÓ: Usem les propietats de la teva interfície
      nameKey: 'topic.react.title', 
      iconName: 'brand-react',      
      colorTheme: 'bg-blue-500', 
      isActive: true,               
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(mockTopicRepo.findBySlug).mockResolvedValue(mockTopic);

    // 2. Simulem que el repositori retorna reptes
    const mockChallenges: Challenge[] = [
      {
        id: 'c1',
        topicId: topicId,
        difficultyTier: 1,
        type: 'QUIZ' as ChallengeType,
        content: {
          question: 'Question in English',
          explanation: 'Explanation',
          correctOptionIndex: 0,
          options: [{ id: 'o1', text: 'Option 1' }]
        },
        createdAt: new Date()
      }
    ];

    vi.mocked(mockChallengeRepo.findNextForUser).mockResolvedValue(mockChallenges);

    const useCase = new GetNextChallengeUseCase(mockTopicRepo, mockChallengeRepo);

    // ACT
    const result = await useCase.execute(topicSlug, userId, locale);

    // ASSERT
    expect(mockTopicRepo.findBySlug).toHaveBeenCalledWith(topicSlug);
    expect(mockChallengeRepo.findNextForUser).toHaveBeenCalledWith(topicId, userId, locale);
    
    expect(result).toHaveLength(1);
    
    // Type narrowing per accedir a les propietats de QuizContent
    const content = result[0].content as QuizContent;
    expect(content.question).toBe('Question in English');
  });
});