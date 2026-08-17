/**
 * DriftCore — Game Engine & Lifecycle Types
 */

export enum GameState {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameScore {
  currentScore: number;
  highScore: number;
  coinsCollected: number;
  energyShardsCollected: number;
}

export interface GameSession {
  sessionId: string;
  levelId: string;
  startTime: number;
  endTime?: number;
  state: GameState;
  score: GameScore;
}
