/**
 * DriftCore — Global Configuration Constants
 */
export const Config = {
  appName: 'DriftCore',
  version: '1.0.0',
  targetFPS: 60,
  storageKeys: {
    SAVE_DATA: '@driftcore_save_data_v1',
    SETTINGS: '@driftcore_settings_v1',
    HIGH_SCORE: '@driftcore_highscore',
  },
  defaultPlayerConfig: {
    initialEnergy: 100,
    maxEnergy: 100,
    baseSpeed: 5.0,
    baseRotationSpeed: 3.5,
  },
} as const;
