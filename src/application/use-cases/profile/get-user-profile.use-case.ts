// filepath: src/application/use-cases/profile/get-user-profile.use-case.ts
import { IProfileRepository } from '../../../core/repositories/profile.repository';
import { UserProfile } from '../../../core/entities/user-profile.entity';

export class GetUserProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<UserProfile | null> {
    return this.profileRepository.getById(userId);
  }
}