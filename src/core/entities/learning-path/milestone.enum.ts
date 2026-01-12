// filepath: src/core/entities/learning-path/milestone.enum.ts

export interface BossConfig {
  titleKey: string;  // 👈 ARA ÉS UNA CLAU, NO TEXT
  color: string;
  iconName: 'medal' | 'trophy' | 'crown' | 'rocket'; // Restringim els tipus d'icona per seguretat
}

export const BOSS_CONFIG: Record<number, BossConfig> = {
  10: {
    titleKey: "milestones.junior",
    color: "bg-blue-500 shadow-blue-500/50", // Blau Junior
    iconName: "medal"
  },
  20: {
    titleKey: "milestones.senior",
    color: "bg-orange-500 shadow-orange-500/50", // Taronja Senior
    iconName: "trophy"
  },
  30: {
    titleKey: "milestones.architect",
    color: "bg-purple-600 shadow-purple-600/50", // Lila Arquitecte
    iconName: "crown"
  },
  40: {
    titleKey: "milestones.legend",
    color: "bg-yellow-500 shadow-yellow-500/50", // Daurat CTO
    iconName: "rocket"
  }
};