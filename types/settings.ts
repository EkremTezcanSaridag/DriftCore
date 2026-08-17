export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SoundConfig {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number; // 0.0 to 1.0
  sfxVolume: number;   // 0.0 to 1.0
}

export interface ISettings {
  sound: SoundConfig;
  hapticsEnabled: boolean;
  graphicsQuality: GraphicsQuality;
  language: string;
}
