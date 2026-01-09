// filepath: src/application/use-cases/gamification/complete-session.use-case.ts
import { IUserRepository } from '@/core/repositories/user.repository';
import { LevelCalculatorService } from '@/core/services/level-calculator.service';

export interface SessionResult {
  xpEarned: number;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
}

export class CompleteSessionUseCase {
  private levelService = new LevelCalculatorService();

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, challengeIds: string[], topicId: string): Promise<SessionResult> {
    const XP_PER_CHALLENGE = 10;
    const totalXpEarned = challengeIds.length * XP_PER_CHALLENGE;

    // 1. Obtenim estat actual
    const userProfile = await this.userRepository.findById(userId);
    
    if (!userProfile) {
      throw new Error(`User ${userId} not found`);
    }

    // 2. Guardem el progrés detallat
    await this.userRepository.saveProgress(userId, challengeIds, topicId, XP_PER_CHALLENGE);

    // 3. Calculem nous valors
    const oldLevel = userProfile.level;
    const newTotalXp = userProfile.totalXp + totalXpEarned;
    const newLevel = this.levelService.calculateLevel(newTotalXp);

    // 4. Actualitzem el perfil si ha canviat alguna cosa
    if (newTotalXp !== userProfile.totalXp) {
        await this.userRepository.updateXp(userId, newTotalXp, newLevel);
    }

    return {
      xpEarned: totalXpEarned,
      newTotalXp,
      newLevel,
      leveledUp: newLevel > oldLevel
    };
  }
}