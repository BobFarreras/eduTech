// filepath: src/application/use-cases/challenges/delete-challenge.use-case.ts
import { IChallengeRepository } from '@/core/repositories/challenge.repository';

export class DeleteChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string): Promise<void> {
    // Aquí podries afegir lògica de seguretat extra, 
    // com verificar que no hi hagi dependències crítiques, 
    // tot i que la BD té ON DELETE CASCADE.
    
    await this.challengeRepository.delete(id);
  }
}