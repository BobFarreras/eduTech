// filepath: src/infrastructure/mappers/level-node.mapper.ts
import { LevelNodeDTO, LevelStatus } from '@/application/dto/level-node.dto';
import { BOSS_CONFIG } from '@/core/entities/learning-path/milestone.enum';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { TierProgressStats } from '@/core/repositories/topic.repository';

export class LevelNodeMapper {
  static toDTO(
    stat: TierProgressStats, 
    currentTier: number,
    isNextPlayable: boolean
  ): LevelNodeDTO {
    
    // 1. Assegurar tipus
    const tier = Number(stat.tier);
    
    // 2. Buscar Config
    const bossConfig = BOSS_CONFIG[tier];
    const isBoss = !!bossConfig;

    // 3. Lògica d'Estat
    let status: LevelStatus = 'LOCKED';
    if (stat.completedChallenges >= stat.totalChallenges && stat.totalChallenges > 0) {
      status = 'COMPLETED';
    } else if (isNextPlayable) {
      status = 'ACTIVE';
    }

    return {
      tier: tier,
      status: status,
      label: isBoss ? 'BOSS LEVEL' : `Nivell ${tier}`, // Label genèric, el títol real va a bossTitleKey
      
      totalChallenges: stat.totalChallenges,
      completedChallenges: stat.completedChallenges,
      
      isCurrentPosition: tier === currentTier,
      predominantType: (stat.mostCommonType as ChallengeType) || 'QUIZ',
      
      // 4. Injectar dades del Boss (i18n ready)
      isBoss: isBoss,
      bossTitleKey: bossConfig?.titleKey, // Enviem la clau
      bossColorClass: bossConfig?.color,
      bossIconName: bossConfig?.iconName
    };
  }
}