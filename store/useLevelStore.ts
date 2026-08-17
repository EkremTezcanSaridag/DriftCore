import { create } from 'zustand';
import { ILevel } from '../types/level';
import { INITIAL_LEVELS } from '../game/levels/LevelRegistry';

interface LevelStoreState {
  levels: ILevel[];
  unlockLevel: (levelId: string) => void;
  updateLevelStars: (levelId: string, stars: number) => void;
}

export const useLevelStore = create<LevelStoreState>((set) => ({
  levels: INITIAL_LEVELS,

  unlockLevel: (levelId) =>
    set((state) => ({
      levels: state.levels.map((level) =>
        level.id === levelId ? { ...level, unlocked: true } : level
      ),
    })),

  updateLevelStars: (levelId, stars) =>
    set((state) => ({
      levels: state.levels.map((level) =>
        level.id === levelId ? { ...level, starsEarned: Math.max(level.starsEarned, stars) } : level
      ),
    })),
}));
