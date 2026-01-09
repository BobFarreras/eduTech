// filepath: src/core/repositories/user.repository.ts
export interface UserProfile {
  id: string;
  totalXp: number;
  level: number;
}

export interface IUserRepository {
  findById(userId: string): Promise<UserProfile | null>;
  saveProgress(userId: string, challengeIds: string[], topicId: string, xpPerChallenge: number): Promise<void>;
  updateXp(userId: string, newXp: number, newLevel: number): Promise<void>;
}