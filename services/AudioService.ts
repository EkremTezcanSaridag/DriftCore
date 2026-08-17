/**
 * DriftCore — Audio Service Abstraction
 * Ready for future Expo Audio sound effect and background music integration.
 */

export interface IAudioService {
  playMusic(soundKey: string): void;
  stopMusic(): void;
  playSFX(sfxKey: string): void;
  setMusicVolume(volume: number): void;
  setSFXVolume(volume: number): void;
}

class MockAudioService implements IAudioService {
  private musicVolume = 1.0;
  private sfxVolume = 1.0;

  playMusic(soundKey: string): void {
    console.log(`[AudioService] Playing music: ${soundKey} (vol: ${this.musicVolume})`);
  }

  stopMusic(): void {
    console.log('[AudioService] Stopping music');
  }

  playSFX(sfxKey: string): void {
    console.log(`[AudioService] Playing SFX: ${sfxKey} (vol: ${this.sfxVolume})`);
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

export const audioService = new MockAudioService();
