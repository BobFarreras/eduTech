// filepath: src/application/use-cases/topics/get-topic-path.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { LevelNodeDTO, LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';

export class GetTopicPathUseCase {

  constructor(private topicRepo: ITopicRepository) { }

  async execute(userId: string, topicId: string) {
    const stats = await this.topicRepo.getTopicProgressSummary(topicId, userId);
    const levels: LevelNodeDTO[] = [];

    // CAS 1: L'usuari mai ha tocat aquest tema (Array buit)
    // Retornem el nivell 1 desbloquejat per defecte.
    if (stats.length === 0) {
      return {
        levels: [{
          tier: 1,
          status: 'ACTIVE' as LevelStatus,
          label: 'Inici',
          totalXp: 0,
          isCurrentPosition: true,
          predominantType: 'QUIZ' as ChallengeType, // ✅ Forcem el tipus aquí també
        }],
        totalXp: 0
      };
    }

    let isPreviousLevelCompleted = true;

    // CAS 2: Iterem sobre l'històric real
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      let status: LevelStatus = 'LOCKED';

      const isCompleted = stat.completedChallenges >= stat.totalChallenges && stat.totalChallenges > 0;

      if (isCompleted) {
        status = 'COMPLETED';
      } else if (isPreviousLevelCompleted) {
        status = 'ACTIVE';
        isPreviousLevelCompleted = false; // Ja tenim un actiu, el següent serà locked
      } else {
        status = 'LOCKED';
      }

      // Lògica per saber on posar el ninotet "You are here"
      const isCurrentPosition = status === 'ACTIVE' || (status === 'COMPLETED' && !stats[i + 1]);

      levels.push({
        tier: stat.tier,
        status,
        label: this.getLevelLabel(stat.tier),
        totalXp: stat.completedChallenges,
        isCurrentPosition: isCurrentPosition, 
        
        // ✅ CORRECCIÓ CLAU:
        // 1. Fem 'as ChallengeType' per calmar TypeScript.
        // 2. Afegim '|| 'QUIZ'' per seguretat si la BD retorna null.
        predominantType: (stat.mostCommonType as ChallengeType) || 'QUIZ'
      });

      if (status === 'COMPLETED') {
        isPreviousLevelCompleted = true;
      }
    }

    // CAS 3: Nivell Següent (Future Level)
    // Si l'últim nivell conegut està completat, n'obrim un de nou buit.
    const lastLevel = levels[levels.length - 1];
    if (lastLevel && lastLevel.status === 'COMPLETED') {
      levels.push({
        tier: lastLevel.tier + 1,
        status: 'ACTIVE' as LevelStatus,
        label: '???',
        totalXp: 0,
        isCurrentPosition: true,
        predominantType: 'QUIZ' as ChallengeType // Per defecte el futur és QUIZ fins que es descobreix
      });
    }

    const totalXp = levels.reduce((acc, curr) => acc + curr.totalXp, 0);
    return { levels, totalXp };
  }

  private getLevelLabel(tier: number): string {
    const labels = ["Fonaments", "Conceptes Clau", "Pràctica", "Avançat", "Expert", "Mestre", "Llegenda"];
    return labels[tier - 1] || `Nivell ${tier}`;
  }
}