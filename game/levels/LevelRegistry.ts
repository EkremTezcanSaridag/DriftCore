import { ILevel, LevelDifficulty } from '../../types/level';

export const INITIAL_LEVELS: ILevel[] = [
  {
    id: 'level_01',
    name: 'Sector 01: Core Awakening',
    description: 'Master basic drift controls and harvest energy shards.',
    difficulty: LevelDifficulty.EASY,
    unlocked: true,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 500,
      energyShardsToCollect: 10,
    },
    rewards: {
      coins: 100,
    },
  },
  {
    id: 'level_02',
    name: 'Sector 02: Asteroid Drift',
    description: 'Navigate through moving kinetic obstacles.',
    difficulty: LevelDifficulty.EASY,
    unlocked: true,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 1200,
      energyShardsToCollect: 20,
    },
    rewards: {
      coins: 250,
    },
  },
  {
    id: 'level_03',
    name: 'Sector 03: Neon Grid',
    description: 'High-speed drift challenge with laser grid barriers.',
    difficulty: LevelDifficulty.MEDIUM,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 2500,
      energyShardsToCollect: 35,
    },
    rewards: {
      coins: 500,
      unlockItemSkinId: 'skin_neon_cyan',
    },
  },
  {
    id: 'level_04',
    name: 'Sector 04: Hyper Pulse',
    description: 'Pulsing forcefields test your precision drift timing.',
    difficulty: LevelDifficulty.HARD,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    requirements: {
      targetScore: 5000,
      energyShardsToCollect: 50,
    },
    rewards: {
      coins: 1000,
    },
  },
];
