import { create } from 'zustand';
import { GameState } from '../types/game';

interface GameStoreState {
  gameState: GameState;
  score: number;
  highScore: number;
  coins: number;
  activeLevelId: string | null;

  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  incrementScore: (amount: number) => void;
  setHighScore: (highScore: number) => void;
  addCoins: (amount: number) => void;
  setActiveLevelId: (levelId: string | null) => void;
  resetSession: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: GameState.IDLE,
  score: 0,
  highScore: 1250, // Initial placeholder high score
  coins: 350,      // Initial placeholder coins
  activeLevelId: 'level_01',

  setGameState: (gameState) => set({ gameState }),
  setScore: (score) => set((state) => ({ score, highScore: Math.max(state.highScore, score) })),
  incrementScore: (amount) =>
    set((state) => {
      const newScore = state.score + amount;
      return {
        score: newScore,
        highScore: Math.max(state.highScore, newScore),
      };
    }),
  setHighScore: (highScore) => set({ highScore }),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  setActiveLevelId: (activeLevelId) => set({ activeLevelId }),
  resetSession: () => set({ gameState: GameState.IDLE, score: 0 }),
}));
