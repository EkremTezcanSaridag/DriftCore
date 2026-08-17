/**
 * DriftCore — Game Engine Architecture Core
 * Handles engine tick subscribers, delta time calculation, and system updates.
 */

export type GameSystemSubscriber = (deltaTime: number) => void;

export class GameEngine {
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private subscribers: Set<GameSystemSubscriber> = new Set();

  /**
   * Subscribe a game system update loop (Physics, Input, Render, Collision)
   */
  public subscribe(system: GameSystemSubscriber): () => void {
    this.subscribers.add(system);
    return () => {
      this.subscribers.delete(system);
    };
  }

  /**
   * Start the engine loop
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = Date.now();
    this.tick();
  }

  /**
   * Pause/Stop the engine loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main Game Loop Step
   */
  private tick = (): void => {
    if (!this.isRunning) return;

    const now = Date.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1); // Cap delta time at 100ms
    this.lastTime = now;

    // Dispatch update step to all registered game systems
    this.subscribers.forEach((subscriber) => subscriber(deltaTime));

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const mainGameEngine = new GameEngine();
