// filepath: src/application/use-cases/topics/get-topic-path.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { LevelNodeDTO, LevelStatus } from '@/application/dto/level-node.dto';

export class GetTopicPathUseCase {

  constructor(private topicRepo: ITopicRepository) { }

  async execute(userId: string, topicId: string) {
    const stats = await this.topicRepo.getTopicProgressSummary(topicId, userId);
    const levels: LevelNodeDTO[] = [];

    // Cas buit
    if (stats.length === 0) {
      return {
        levels: [{
          tier: 1,
          status: 'ACTIVE' as LevelStatus,
          label: 'Inici',
          totalXp: 0,
          isCurrentPosition: true,
          predominantType: 'QUIZ', 
        }],
        totalXp: 0
      };
    }

    let isPreviousLevelCompleted = true;

    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      let status: LevelStatus = 'LOCKED';

      const isCompleted = stat.completedChallenges >= stat.totalChallenges && stat.totalChallenges > 0;

      if (isCompleted) {
        status = 'COMPLETED';
      } else if (isPreviousLevelCompleted) {
        status = 'ACTIVE';
        isPreviousLevelCompleted = false;
      } else {
        status = 'LOCKED';
      }

      const isCurrentPosition = status === 'ACTIVE' || (status === 'COMPLETED' && !stats[i + 1]);

      levels.push({
        tier: stat.tier,
        status,
        label: this.getLevelLabel(stat.tier),
        totalXp: stat.completedChallenges,
        isCurrentPosition: isCurrentPosition, 
        
        // ✅ CORRECCIÓ 1: Dins del bucle, usem la dada real de la BD
        predominantType: stat.mostCommonType 
      });

      if (status === 'COMPLETED') {
        isPreviousLevelCompleted = true;
      }
    }

    // Nivell Extra (Infinit)
    const lastLevel = levels[levels.length - 1];
    if (lastLevel && lastLevel.status === 'COMPLETED') {
      levels.push({
        tier: lastLevel.tier + 1,
        status: 'ACTIVE' as LevelStatus,
        label: '???',
        totalXp: 0,
        isCurrentPosition: true,
        
        // ✅ CORRECCIÓ 2: Fora del bucle, 'stat' no existeix. 
        // Posem 'QUIZ' per defecte al nivell futur.
        predominantType: 'QUIZ' 
      });
    }

    const totalXp = levels.reduce((acc, curr) => acc + curr.totalXp, 0);
    return { levels, totalXp };
  }

  private getLevelLabel(tier: number): string {
    const labels = ["Fonaments", "Conceptes Clau", "Pràctica", "Avançat", "Expert", "Mestre", "Llegenda"];
    return labels[tier - 1] || `Secció ${tier}`;
  }
}