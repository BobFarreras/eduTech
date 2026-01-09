// filepath: src/core/services/level-calculator.service.ts
export class LevelCalculatorService {
  /**
   * Fórmula simple: Nivell = (TotalXP / 100) + 1
   * 0-99 XP -> Nivell 1
   * 100-199 XP -> Nivell 2
   */
  calculateLevel(totalXp: number): number {
    if (totalXp < 0) return 1;
    return Math.floor(totalXp / 100) + 1;
  }

  /**
   * Calcula el % de progrés cap al següent nivell.
   */
  calculateProgressToNextLevel(totalXp: number): number {
    const currentLevel = this.calculateLevel(totalXp);
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpInCurrentLevel = totalXp - xpForCurrentLevel;
    
    return Math.min(100, Math.max(0, xpInCurrentLevel));
  }
}