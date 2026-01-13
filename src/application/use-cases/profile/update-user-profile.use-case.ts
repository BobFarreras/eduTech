// filepath: src/application/use-cases/profile/update-user-profile.use-case.ts
import { IProfileRepository } from '../../../core/repositories/profile.repository';
import { EditableProfileFields } from '../../../core/entities/user-profile.entity';

export class UpdateUserProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(userId: string, data: EditableProfileFields): Promise<void> {
    // 1. Validació de Negoci (Business Rules)
    
    if (data.username !== undefined) {
      const trimmedName = data.username.trim();
      if (trimmedName.length < 3 || trimmedName.length > 20) {
        throw new Error("El nom d'usuari ha de tenir entre 3 i 20 caràcters.");
      }
      // Sanitització: guardem el nom sense espais extra
      data.username = trimmedName;
    }

    if (data.avatarIcon !== undefined) {
      // Els emojis poden ocupar fins a 4 caràcters (o més si són compostos), 
      // però "Això no és un emoji" en té molts més.
      if (data.avatarIcon.length > 5) {
        throw new Error("L'avatar no és vàlid.");
      }
    }

    // 2. Persistència
    await this.profileRepository.update(userId, data);
  }
}