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
    baseSpeed: 220,
    baseRotationSpeed: 3.5,
  },
  gameplay: {
    CORE_SPEED: 220, // Pixels per second
    CORE_RADIUS: 16, // Core radius in pixels
    SCORE_PER_SECOND: 10, // Points per second alive
  },
} as const;

