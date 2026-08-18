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

export interface RelativeObstacle {
  xRatio: number;      // 0.0 to 1.0 relative to arena width
  yRatio: number;      // 0.0 to 1.0 relative to arena height
  widthRatio: number;  // relative to arena width
  heightRatio: number; // relative to arena height
  color?: string;
  name?: string;
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
  startPosRatio?: { x: number; y: number };
  startDirectionIndex?: number; // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
  obstacles?: RelativeObstacle[];
  completionScore?: number;
}
