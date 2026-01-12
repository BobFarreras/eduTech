// filepath: src/application/use-cases/challenges/update-challenge.use-case.ts
import { IChallengeRepository, UpdateChallengeInput } from '@/core/repositories/challenge.repository';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { UpdateChallengeSchemaType } from '@/application/dto/challenge.schema';

export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, input: UpdateChallengeSchemaType): Promise<Challenge> {
    // 1. Validacions de negoci addicionals podrien anar aquí
    // (Ex: Comprovar si el repte existeix abans d'intentar update, 
    // tot i que el repositori ja llançarà error si no el troba).

    // 2. Adaptació de tipus (Zod -> Domain)
    const domainInput = input as unknown as UpdateChallengeInput;

    // 3. Persistència
    return await this.challengeRepository.update(id, domainInput);
  }
}