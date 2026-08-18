import { ILevel, LevelDifficulty } from '../../types/level';
import { Colors } from '../../constants/colors';

export const LEVEL_01_DATA: ILevel = {
  id: 'level_01',
  name: 'Level 1: First Drift',
  description: 'Temel yön değiştirme ve engellerden kaçma rotasını öğrenin.',
  difficulty: LevelDifficulty.EASY,
  unlocked: true,
  starsEarned: 0,
  highScore: 0,
  startPosRatio: { x: 0.5, y: 0.82 }, // Start near bottom-center
  startDirectionIndex: 0, // 0: UP
  completionScore: 200, // 200 points (~20s survival) to complete level 1
  requirements: {
    targetScore: 200,
    energyShardsToCollect: 0,
  },
  rewards: {
    coins: 100,
  },
  obstacles: [
    // Stage 1: Learn - Center-top horizontal barrier (forces initial TAP RIGHT/LEFT)
    {
      name: 'Stage 1 Guide Barrier',
      xRatio: 0.22,
      yRatio: 0.45,
      widthRatio: 0.56,
      heightRatio: 0.06,
      color: Colors.secondary,
    },
    // Stage 2: First Escape - Left and Right side barriers
    {
      name: 'Stage 2 Right Wall',
      xRatio: 0.72,
      yRatio: 0.55,
      widthRatio: 0.12,
      heightRatio: 0.25,
      color: Colors.warning,
    },
    {
      name: 'Stage 2 Left Wall',
      xRatio: 0.16,
      yRatio: 0.55,
      widthRatio: 0.12,
      heightRatio: 0.25,
      color: Colors.warning,
    },
    // Stage 3: Narrow Passage - Upper central block
    {
      name: 'Stage 3 Core Block',
      xRatio: 0.4,
      yRatio: 0.18,
      widthRatio: 0.2,
      heightRatio: 0.14,
      color: Colors.accent,
    },
    // Stage 4: Top Left & Right Gate Pillars
    {
      name: 'Stage 4 Left Gate',
      xRatio: 0.08,
      yRatio: 0.1,
      widthRatio: 0.15,
      heightRatio: 0.08,
      color: Colors.primary,
    },
    {
      name: 'Stage 4 Right Gate',
      xRatio: 0.77,
      yRatio: 0.1,
      widthRatio: 0.15,
      heightRatio: 0.08,
      color: Colors.primary,
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
    description: 'İleri seviye refleks ve refleks zamanlaması testi.',
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
