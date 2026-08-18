import { ILevel, LevelDifficulty } from '../../types/level';
import { Colors } from '../../constants/colors';

export const LEVEL_01_DATA: ILevel = {
  id: 'level_01',
  name: 'Level 1: First Drift',
  description: 'Sezgisel viraj rotasını takip edin, zamanında tap yapın ve bitişe ulaşın.',
  difficulty: LevelDifficulty.EASY,
  unlocked: true,
  starsEarned: 0,
  highScore: 0,
  startPosRatio: { x: 0.5, y: 0.85 }, // Safe bottom-center start
  startDirectionIndex: 0, // 0: UP
  completionScore: 200, // 200 points (~20s smooth circuit run) to complete level 1
  requirements: {
    targetScore: 200,
    energyShardsToCollect: 0,
  },
  rewards: {
    coins: 100,
  },
  obstacles: [
    // 1. TURN 1 GUIDE: Top-Center Barrier (forces TAP -> RIGHT)
    {
      name: 'Turn 1 Top Barrier',
      xRatio: 0.2,
      yRatio: 0.35,
      widthRatio: 0.6,
      heightRatio: 0.05,
      color: Colors.secondary,
    },
    // 2. TURN 2 GUIDE: Far Right Barrier (forces TAP -> DOWN)
    {
      name: 'Turn 2 Right Wall',
      xRatio: 0.78,
      yRatio: 0.35,
      widthRatio: 0.08,
      heightRatio: 0.45,
      color: Colors.warning,
    },
    // 3. TURN 3 GUIDE: Bottom Right Barrier (forces TAP -> LEFT)
    {
      name: 'Turn 3 Bottom Wall',
      xRatio: 0.35,
      yRatio: 0.78,
      widthRatio: 0.5,
      heightRatio: 0.05,
      color: Colors.secondary,
    },
    // 4. TURN 4 GUIDE: Left Return Wall (forces TAP -> UP into Finish Zone)
    {
      name: 'Turn 4 Left Wall',
      xRatio: 0.14,
      yRatio: 0.42,
      widthRatio: 0.08,
      heightRatio: 0.42,
      color: Colors.accent,
    },
  ],
};

export const INITIAL_LEVELS: ILevel[] = [
  LEVEL_01_DATA,
  {
    id: 'level_02',
    name: 'Level 2: Asteroid Path',
    description: 'Dar geçenlerde hassas tap zamanlaması gerektirir.',
    difficulty: LevelDifficulty.EASY,
    unlocked: false, // Locked until Level 1 completed
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 500,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 250,
    },
  },
  {
    id: 'level_03',
    name: 'Level 3: Neon Grid',
    description: 'Yüksek hızlı labirent ve dar viraj rotası.',
    difficulty: LevelDifficulty.MEDIUM,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 1000,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 500,
      unlockItemSkinId: 'skin_neon_cyan',
    },
  },
  {
    id: 'level_04',
    name: 'Level 4: Hyper Pulse',
    description: 'İleri seviye refleks ve zamanlama testi.',
    difficulty: LevelDifficulty.HARD,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 2000,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 1000,
    },
  },
];

export class LevelRegistry {
  public static getLevelById(id: string): ILevel {
    const found = INITIAL_LEVELS.find((lvl) => lvl.id === id);
    return found || LEVEL_01_DATA;
  }
}
