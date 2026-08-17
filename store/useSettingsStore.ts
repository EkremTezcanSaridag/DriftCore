import { create } from 'zustand';
import { GraphicsQuality, ISettings } from '../types/settings';

interface SettingsStoreState extends ISettings {
  toggleMusic: () => void;
  toggleSfx: () => void;
  toggleHaptics: () => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: ISettings = {
  sound: {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.8,
    sfxVolume: 1.0,
  },
  hapticsEnabled: true,
  graphicsQuality: 'HIGH',
  language: 'tr',
};

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  ...DEFAULT_SETTINGS,

  toggleMusic: () =>
    set((state) => ({
      sound: { ...state.sound, musicEnabled: !state.sound.musicEnabled },
    })),

  toggleSfx: () =>
    set((state) => ({
      sound: { ...state.sound, sfxEnabled: !state.sound.sfxEnabled },
    })),

  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),

  resetSettings: () => set({ ...DEFAULT_SETTINGS }),
}));
