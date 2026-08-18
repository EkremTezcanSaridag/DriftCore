import { Audio } from 'expo-av';

class SoundService {
  private soundObjects: { [key: string]: Audio.Sound } = {};
  private isLoaded: boolean = false;
  private soundEnabled: boolean = true;
  private isEngineRunning: boolean = false;
  private isDrifting: boolean = false;

  public async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const soundFiles: { [key: string]: { source: any; isLooping?: boolean } } = {
        engine_loop: { source: require('../assets/sounds/engine_loop.wav'), isLooping: true },
        drift_loop: { source: require('../assets/sounds/drift_loop.wav'), isLooping: true },
        turbo_blowoff: { source: require('../assets/sounds/turbo_blowoff.wav') },
        hook: { source: require('../assets/sounds/hook.wav') },
        pickup: { source: require('../assets/sounds/pickup.wav') },
        coin: { source: require('../assets/sounds/coin.wav') },
        crash: { source: require('../assets/sounds/crash.wav') },
        victory: { source: require('../assets/sounds/victory.wav') },
        ui_click: { source: require('../assets/sounds/ui_click.wav') },
        ui_start: { source: require('../assets/sounds/ui_start.wav') },
      };

      for (const [key, config] of Object.entries(soundFiles)) {
        const { sound } = await Audio.Sound.createAsync(config.source, {
          shouldPlay: false,
          isLooping: !!config.isLooping,
          volume: 0.7,
        });
        this.soundObjects[key] = sound;
      }

      this.isLoaded = true;
    } catch (e) {
      console.warn('SoundService initialization warning:', e);
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAllLoops();
    }
  }

  // --- CONTINUOUS ENGINE LOOP ---
  public async startEngine(): Promise<void> {
    if (!this.soundEnabled || this.isEngineRunning) return;
    try {
      const engineSound = this.soundObjects['engine_loop'];
      if (engineSound) {
        await engineSound.setIsLoopingAsync(true);
        await engineSound.setVolumeAsync(0.5);
        await engineSound.playAsync();
        this.isEngineRunning = true;
      }
    } catch {}
  }

  public async setEngineNitro(isNitro: boolean): Promise<void> {
    if (!this.soundEnabled || !this.isEngineRunning) return;
    try {
      const engineSound = this.soundObjects['engine_loop'];
      if (engineSound) {
        await engineSound.setVolumeAsync(isNitro ? 0.85 : 0.5);
        await engineSound.setRateAsync(isNitro ? 1.25 : 1.0, true);
      }
    } catch {}
  }

  public async stopEngine(): Promise<void> {
    if (!this.isEngineRunning) return;
    try {
      const engineSound = this.soundObjects['engine_loop'];
      if (engineSound) {
        await engineSound.stopAsync();
      }
    } catch {}
    this.isEngineRunning = false;
  }

  // --- CONTINUOUS TIRE DRIFT SCREECH LOOP ---
  public async startDriftScreech(): Promise<void> {
    if (!this.soundEnabled || this.isDrifting) return;
    try {
      const driftSound = this.soundObjects['drift_loop'];
      if (driftSound) {
        await driftSound.setIsLoopingAsync(true);
        await driftSound.setVolumeAsync(0.95);
        await driftSound.playAsync();
        this.isDrifting = true;
      }
    } catch {}
  }

  public async stopDriftScreech(): Promise<void> {
    if (!this.isDrifting) return;
    try {
      const driftSound = this.soundObjects['drift_loop'];
      if (driftSound) {
        await driftSound.stopAsync();
      }
    } catch {}
    this.isDrifting = false;
  }

  // --- ONE-SHOT SFX ---
  private async play(key: string, volume: number = 0.8): Promise<void> {
    if (!this.soundEnabled) return;
    try {
      const sound = this.soundObjects[key];
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.replayAsync();
      }
    } catch {}
  }

  public playHook(): void {
    this.play('hook', 0.85);
  }

  public playTurboBlowoff(): void {
    this.play('turbo_blowoff', 0.9);
  }

  public playPickup(): void {
    this.play('pickup', 0.8);
  }

  public playCoin(): void {
    this.play('coin', 0.75);
  }

  public playCrash(): void {
    this.stopAllLoops();
    this.play('crash', 1.0);
  }

  public playVictory(): void {
    this.stopAllLoops();
    this.play('victory', 0.95);
  }

  public playUiClick(): void {
    this.play('ui_click', 0.6);
  }

  public playUiStart(): void {
    this.play('ui_start', 0.9);
  }

  public stopAllLoops(): void {
    this.stopEngine();
    this.stopDriftScreech();
  }

  public async unloadAll(): Promise<void> {
    this.stopAllLoops();
    for (const sound of Object.values(this.soundObjects)) {
      try {
        await sound.unloadAsync();
      } catch {}
    }
    this.soundObjects = {};
    this.isLoaded = false;
  }
}

export const soundService = new SoundService();
