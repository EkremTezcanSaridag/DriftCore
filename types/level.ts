export enum LevelDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME',
}

export interface LevelRequirement {
  targetScore: number;
  energyShardsToCollect: number;
  maxTimeSeconds?: number;
}

export interface LevelReward {
  coins: number;
  unlockItemSkinId?: string;
}

export interface ILevel {
  id: string;
  name: string;
  description: string;
  difficulty: LevelDifficulty;
  unlocked: boolean;
  starsEarned: number; // 0 to 3
  highScore: number;
  requirements: LevelRequirement;
  rewards: LevelReward;
}
