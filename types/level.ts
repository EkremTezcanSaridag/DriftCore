import { DriftAnchor } from './physics';

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

export interface RelativeAnchor {
  id: string;
  name?: string;
  xRatio: number;
  yRatio: number;
  radius?: number;     // default 16
  activeRange?: number;// default 160
  color?: string;
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
  startAngle?: number; // In degrees (0 = UP)
  anchors?: RelativeAnchor[];
  finishLineYRatio?: number; // Default 0.08
  completionScore?: number;
}
