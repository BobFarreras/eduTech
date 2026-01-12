// filepath: src/infrastructure/mappers/level-node.mapper.ts
import { LevelNodeDTO, LevelStatus } from '@/application/dto/level-node.dto';
import { ChallengeType } from '@/core/entities/challenges/challenge.entity';
import { TierProgressStats } from '@/core/repositories/topic.repository';

export class LevelNodeMapper {
  static toDTO(
    stat: TierProgressStats, 
    currentTier: number,
    isNextPlayable: boolean
  ): LevelNodeDTO {
    
    const tier = Number(stat.tier);
    
    // ✅ FIX: Eliminem "|| {}" perquè això feia que TypeScript pensés que era un objecte buit.
    // Simplement accedim a stat.mapConfig directament.
    const config = stat.mapConfig; 
    
    // Si config és null/undefined, l'operador ?. retorna undefined.
    // !!undefined es converteix en false.
    const isBoss = !!config?.isBoss;

    // 2. Lògica d'Estat (Sense canvis)
    let status: LevelStatus = 'LOCKED';
    if (stat.completedChallenges >= stat.totalChallenges && stat.totalChallenges > 0) {
      status = 'COMPLETED';
    } else if (isNextPlayable) {
      status = 'ACTIVE';
    }

    return {
      tier: tier,
      status: status,
      label: isBoss ? 'BOSS LEVEL' : `Nivell ${tier}`,
      
      totalChallenges: stat.totalChallenges,
      completedChallenges: stat.completedChallenges,
      
      isCurrentPosition: tier === currentTier,
      predominantType: (stat.mostCommonType as ChallengeType) || 'QUIZ',
      
      // ✅ 3. FIX: Accedim a totes les propietats amb ?. (Optional Chaining)
      // Si config és null, aquestes propietats seran undefined, que és vàlid per al DTO.
      isBoss: isBoss,
      bossTitleKey: config?.bossTitle, 
      bossColorClass: config?.bossColor,
      bossIconName: config?.bossIcon 
    };
  }
}