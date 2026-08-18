import { Audio } from 'expo-av';

class SoundService {
  private soundObjects: { [key: string]: Audio.Sound } = {};
  private isLoaded: boolean = false;
  private soundEnabled: boolean = true;

  public async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const soundFiles: { [key: string]: any } = {
        hook: require('../assets/sounds/hook.wav'),
        boost: require('../assets/sounds/boost.wav'),
        pickup: require('../assets/sounds/pickup.wav'),
        coin: require('../assets/sounds/coin.wav'),
        crash: require('../assets/sounds/crash.wav'),
        victory: require('../assets/sounds/victory.wav'),
      };

      for (const [key, source] of Object.entries(soundFiles)) {
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: false,
          volume: 0.8,
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
  }

  private async play(key: string, volume: number = 0.8): Promise<void> {
    if (!this.soundEnabled) return;
    try {
      const sound = this.soundObjects[key];
      if (sound) {
        await sound.setVolumeAsync(volume);
        await sound.replayAsync();
      }
    } catch {
      // Ignore audio replay hiccups
    }
  }

  public playHook(): void {
    this.play('hook', 0.85);
  }

  public playBoost(): void {
    this.play('boost', 0.9);
  }

  public playPickup(): void {
    this.play('pickup', 0.75);
  }

  public playCoin(): void {
    this.play('coin', 0.7);
  }

  public playCrash(): void {
    this.play('crash', 1.0);
  }

  public playVictory(): void {
    this.play('victory', 0.95);
  }

  public async unloadAll(): Promise<void> {
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
