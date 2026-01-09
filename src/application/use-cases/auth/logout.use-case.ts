// filepath: src/application/use-cases/auth/logout.use-case.ts
import { IAuthService } from '@/core/services/auth.service';

export class LogoutUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<void> {
    await this.authService.logout();
  }
}