import { ILevel, LevelDifficulty } from '../../types/level';
import { Colors } from '../../constants/colors';

export const LEVEL_01_DATA: ILevel = {
  id: 'level_01',
  name: 'Sector 01: Neon Highway',
  description: '5 virajlı dikey neon otoyolunda kanca atarak drift ustası olun!',
  difficulty: LevelDifficulty.EASY,
  unlocked: true,
  starsEarned: 0,
  highScore: 0,
  trackLength: 2400, // 2400px long scrolling highway
  startPosRatio: { x: 0.35, yWorld: 2250 },
  startAngle: 0,     // Heading straight UP
  finishLineY: 120,  // Finish gate at top
  completionScore: 500,
  requirements: {
    targetScore: 500,
    energyShardsToCollect: 0,
  },
  rewards: {
    coins: 200,
  },
  anchors: [
    // 1. Viraj: Sağ Açılı Drift (Turn 1 Right)
    {
      id: 'anchor_01',
      name: 'Apex 1 (Sağ Viraj)',
      xRatio: 0.65,
      yWorld: 1850,
      radius: 16,
      activeRange: 160,
      color: Colors.secondary,
    },
    // 2. Viraj: Sol Açılı Drift (Turn 2 Left)
    {
      id: 'anchor_02',
      name: 'Apex 2 (Sol Viraj)',
      xRatio: 0.35,
      yWorld: 1450,
      radius: 16,
      activeRange: 160,
      color: Colors.primary,
    },
    // 3. Viraj: Keskin Sağ Viraj (Turn 3 Sharp Right)
    {
      id: 'anchor_03',
      name: 'Apex 3 (Keskin Sağ)',
      xRatio: 0.7,
      yWorld: 1050,
      radius: 16,
      activeRange: 160,
      color: Colors.warning,
    },
    // 4. Viraj: Hızlı Sol Viraj (Turn 4 Fast Left)
    {
      id: 'anchor_04',
      name: 'Apex 4 (Hızlı Sol)',
      xRatio: 0.3,
      yWorld: 680,
      radius: 16,
      activeRange: 160,
      color: Colors.secondary,
    },
    // 5. Viraj: Bitiş Girişi Sağ Viraj (Turn 5 Final Straight Entry)
    {
      id: 'anchor_05',
      name: 'Apex 5 (Final Viraj)',
      xRatio: 0.55,
      yWorld: 380,
      radius: 16,
      activeRange: 160,
      color: Colors.primary,
    },
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
    trackLength: 3200,
    startPosRatio: { x: 0.5, yWorld: 3000 },
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
    trackLength: 4000,
    startPosRatio: { x: 0.5, yWorld: 3800 },
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
