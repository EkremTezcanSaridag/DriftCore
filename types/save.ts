import { ISettings } from './settings';

export interface SaveMetadata {
  version: string;
  createdAt: number;
  lastSavedAt: number;
}

export interface ISaveData {
  metadata: SaveMetadata;
  highScore: number;
  totalCoins: number;
  unlockedLevelIds: string[];
  levelStars: Record<string, number>;
  unlockedItemIds: string[];
  equippedSkinId: string;
  equippedTrailId: string;
  settings: ISettings;
}
