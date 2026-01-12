// filepath: src/application/use-cases/topics/get-topic-path.use-case.ts
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { LevelNodeDTO } from '@/application/dto/level-node.dto';
import { LevelNodeMapper } from '@/infrastructure/mappers/level-node.mapper';

export class GetTopicPathUseCase {
  constructor(private topicRepo: ITopicRepository) {}

  async execute(userId: string, topicId: string) {
    const stats = await this.topicRepo.getTopicProgressSummary(topicId, userId);
    
    // 1. Determinem quin és el "Current Tier" (el primer que NO està completat)
    // Si tots estan complets, el current és l'últim + 1.
    const lastCompletedStat = [...stats].reverse().find(s => s.completedChallenges >= s.totalChallenges && s.totalChallenges > 0);
    const maxTierReached = lastCompletedStat ? lastCompletedStat.tier : 0;
    const currentTier = maxTierReached + 1;

    const levels: LevelNodeDTO[] = [];
    
    // 2. Mapegem NOMÉS els nivells que tenim a la Base de Dades (stats)
    for (const stat of stats) {
      const isNextPlayable = stat.tier === currentTier;
      const node = LevelNodeMapper.toDTO(stat, currentTier, isNextPlayable);
      levels.push(node);
    }

    // 3. AFEGIM NOMÉS EL SEGÜENT NIVELL (si no existeix ja a stats)
    // Això evita mostrar el Boss 20 si estem al 8.
    // Només mostrarem el nivell on estàs ara, encara que estigui buit de dades de progrés.
    const hasCurrentInStats = levels.some(l => l.tier === currentTier);
    
    if (!hasCurrentInStats) {
        // Creem un node "fake" per al nivell on estem ara, perquè l'usuari vegi l'objectiu
        const fakeStat = {
            tier: currentTier,
            totalChallenges: 10, // Placeholder
            completedChallenges: 0,
            mostCommonType: 'QUIZ' as const // Default
        };
        // Aquí és on la màgia del Mapper detectarà si aquest 'currentTier' és un Boss o no
        levels.push(LevelNodeMapper.toDTO(fakeStat, currentTier, true));
    }

    // Calcular XP Total
    const totalXp = levels.reduce((acc, curr) => acc + (curr.completedChallenges * 10), 0);

    // Ordenem per tier per si de cas
    return { levels: levels.sort((a, b) => a.tier - b.tier), totalXp };
  }
}