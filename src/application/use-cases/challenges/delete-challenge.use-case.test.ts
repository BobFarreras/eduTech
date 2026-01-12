// filepath: src/application/use-cases/challenges/delete-challenge.use-case.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteChallengeUseCase } from './delete-challenge.use-case';
import { IChallengeRepository } from '@/core/repositories/challenge.repository';

describe('DeleteChallengeUseCase', () => {
  let useCase: DeleteChallengeUseCase;
  let mockChallengeRepo: IChallengeRepository;

  const challengeId = 'to-delete-uuid';

  beforeEach(() => {
    mockChallengeRepo = {
      findNextForUser: vi.fn(),
      findByTopicId: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined), // Delete retorna void
    };

    useCase = new DeleteChallengeUseCase(mockChallengeRepo);
  });

  it('hauria de cridar al mètode delete del repositori', async () => {
    // Act
    await useCase.execute(challengeId);

    // Assert
    expect(mockChallengeRepo.delete).toHaveBeenCalledTimes(1);
    expect(mockChallengeRepo.delete).toHaveBeenCalledWith(challengeId);
  });

  it('hauria de propagar errors del sistema', async () => {
    // Arrange
    mockChallengeRepo.delete = vi.fn().mockRejectedValue(new Error('DB Error'));

    // Act & Assert
    await expect(useCase.execute(challengeId)).rejects.toThrow('DB Error');
  });
});