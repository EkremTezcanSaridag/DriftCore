import { ILevel, LevelDifficulty } from '../../types/level';
import { Colors } from '../../constants/colors';

export const LEVEL_01_DATA: ILevel = {
  id: 'level_01',
  name: 'Sector 01: Neon Highway',
  description: '5 virajlı dikey neon otoyolunda kanca atarak drift ustası olun, kristalleri toplayın!',
  difficulty: LevelDifficulty.EASY,
  unlocked: true,
  starsEarned: 0,
  highScore: 0,
  trackLength: 2600, // 2600px long scrolling highway
  startPosRatio: { x: 0.35, yWorld: 2450 },
  startAngle: 0,     // Heading straight UP
  finishLineY: 120,  // Finish gate at top
  completionScore: 600,
  requirements: {
    targetScore: 600,
    energyShardsToCollect: 5,
  },
  rewards: {
    coins: 250,
  },
  anchors: [
    // 1. Viraj: Geniş Sağ Viraj (Turn 1 Wide Right)
    {
      id: 'anchor_01',
      name: 'Apex 1 (Sağ Viraj)',
      xRatio: 0.65,
      yWorld: 2000,
      radius: 20,
      activeRange: 180,
      color: Colors.secondary,
    },
    // 2. Viraj: Geniş Sol Viraj (Turn 2 Wide Left)
    {
      id: 'anchor_02',
      name: 'Apex 2 (Sol Viraj)',
      xRatio: 0.35,
      yWorld: 1550,
      radius: 20,
      activeRange: 180,
      color: Colors.primary,
    },
    // 3. Viraj: Keskin Sağ Viraj (Turn 3 Sharp Right)
    {
      id: 'anchor_03',
      name: 'Apex 3 (Keskin Sağ)',
      xRatio: 0.68,
      yWorld: 1100,
      radius: 20,
      activeRange: 180,
      color: Colors.warning,
    },
    // 4. Viraj: Hızlı Sol Viraj (Turn 4 Fast Left)
    {
      id: 'anchor_04',
      name: 'Apex 4 (Hızlı Sol)',
      xRatio: 0.32,
      yWorld: 700,
      radius: 20,
      activeRange: 180,
      color: Colors.secondary,
    },
    // 5. Viraj: Final Düzlük Girişi (Turn 5 Final Straight Entry)
    {
      id: 'anchor_05',
      name: 'Apex 5 (Final Viraj)',
      xRatio: 0.58,
      yWorld: 380,
      radius: 20,
      activeRange: 180,
      color: Colors.primary,
    },
  ],
  collectibles: [
    // Turn 1 Shard & Coin
    { id: 'shard_01', type: 'shard', xRatio: 0.78, yWorld: 1950, color: Colors.primary },
    { id: 'coin_01', type: 'coin', xRatio: 0.35, yWorld: 2200 },

    // Turn 2 Shard & Coin
    { id: 'shard_02', type: 'shard', xRatio: 0.22, yWorld: 1500, color: Colors.secondary },
    { id: 'coin_02', type: 'coin', xRatio: 0.5, yWorld: 1750 },

    // Turn 3 Shard & Coin
    { id: 'shard_03', type: 'shard', xRatio: 0.8, yWorld: 1050, color: Colors.warning },
    { id: 'coin_03', type: 'coin', xRatio: 0.45, yWorld: 1300 },

    // Turn 4 Shard & Coin
    { id: 'shard_04', type: 'shard', xRatio: 0.18, yWorld: 650, color: Colors.primary },
    { id: 'coin_04', type: 'coin', xRatio: 0.6, yWorld: 880 },

    // Turn 5 Shard & Final Straight Coins
    { id: 'shard_05', type: 'shard', xRatio: 0.72, yWorld: 330, color: Colors.secondary },
    { id: 'coin_05', type: 'coin', xRatio: 0.5, yWorld: 500 },
    { id: 'coin_06', type: 'coin', xRatio: 0.5, yWorld: 220 },
  ],
};

export const INITIAL_LEVELS: ILevel[] = [
  LEVEL_01_DATA,
  {
    id: 'level_02',
    name: 'Sector 02: Cyber S-Loops',
    description: 'Ardışık dar S-virajları ve yüksek hızlı kanca refleksleri.',
    difficulty: LevelDifficulty.MEDIUM,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    trackLength: 3400,
    startPosRatio: { x: 0.5, yWorld: 3200 },
    startAngle: 0,
    finishLineY: 120,
    anchors: [],
    requirements: {
      targetScore: 1000,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 400,
    },
  },
  {
    id: 'level_03',
    name: 'Sector 03: Neon Grid Hairpin',
    description: '180 derece U-virajları ve dar neon lazer koridorları.',
    difficulty: LevelDifficulty.HARD,
    unlocked: false,
    starsEarned: 0,
    highScore: 0,
    trackLength: 4200,
    startPosRatio: { x: 0.5, yWorld: 4000 },
    startAngle: 0,
    finishLineY: 120,
    anchors: [],
    requirements: {
      targetScore: 2000,
      energyShardsToCollect: 0,
    },
    rewards: {
      coins: 800,
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
