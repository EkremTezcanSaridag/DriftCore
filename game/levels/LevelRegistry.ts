import { ILevel, LevelDifficulty } from '../../types/level';
import { Colors } from '../../constants/colors';

export const LEVEL_01_DATA: ILevel = {
  id: 'level_01',
  name: 'Sector 01: Neon Highway',
  description: 'Virajlara yaklaşırken basılı tutun, kanca ile drift atın ve doğru zamanda bırakın!',
  difficulty: LevelDifficulty.EASY,
  unlocked: true,
  starsEarned: 0,
  highScore: 0,
  startPosRatio: { x: 0.3, y: 0.88 }, // Start in left lane heading UP
  startAngle: 0,                       // 0 degrees = UP
  finishLineYRatio: 0.08,             // Reaching top completes track
  completionScore: 250,
  requirements: {
    targetScore: 250,
    energyShardsToCollect: 0,
  },
  rewards: {
    coins: 150,
  },
  anchors: [
    // 1. Right Drift Turn Anchor (First curve)
    {
      id: 'anchor_01',
      name: 'Apex Alpha (Right Turn)',
      xRatio: 0.55,
      yRatio: 0.64,
      radius: 16,
      activeRange: 150,
      color: Colors.secondary,
    },
    // 2. Left Drift Turn Anchor (Second curve towards finish)
    {
      id: 'anchor_02',
      name: 'Apex Beta (Left Turn)',
      xRatio: 0.45,
      yRatio: 0.34,
      radius: 16,
      activeRange: 150,
      color: Colors.primary,
    },
  ],
};

export const INITIAL_LEVELS: ILevel[] = [
  LEVEL_01_DATA,
  {
    id: 'level_02',
    name: 'Sector 02: Cyber S-Loops',
    description: 'Ardışık dar S-virajları ve hassas kanca bırakma zamanlaması.',
    difficulty: LevelDifficulty.EASY,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 600,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 300,
    },
  },
  {
    id: 'level_03',
    name: 'Sector 03: Neon Grid Hairpin',
    description: 'Yüksek hızlı 180 derece U-virajları.',
    difficulty: LevelDifficulty.MEDIUM,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 1200,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 600,
      unlockItemSkinId: 'skin_neon_cyan',
    },
  },
];

export class LevelRegistry {
  public static getLevelById(id: string): ILevel {
    const found = INITIAL_LEVELS.find((lvl) => lvl.id === id);
    return found || LEVEL_01_DATA;
  }
}
