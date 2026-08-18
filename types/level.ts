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

export interface TrackAnchorData {
  id: string;
  name?: string;
  xRatio: number;      // 0.0 to 1.0 of viewport width
  yWorld: number;      // Absolute world Y coordinate (from top 0 to trackLength)
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
  trackLength: number; // e.g. 2400px
  startPosRatio: { x: number; yWorld: number };
  startAngle?: number; // In degrees (0 = UP)
  anchors: TrackAnchorData[];
  finishLineY: number; // e.g. 120
  completionScore?: number;
}
