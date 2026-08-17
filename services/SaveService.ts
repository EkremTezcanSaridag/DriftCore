import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISaveData } from '../types/save';
import { Config } from '../constants/config';

export interface ISaveService {
  save(data: ISaveData): Promise<boolean>;
  load(): Promise<ISaveData | null>;
  clear(): Promise<boolean>;
}

export class AsyncStorageSaveService implements ISaveService {
  async save(data: ISaveData): Promise<boolean> {
    try {
      const payload: ISaveData = {
        ...data,
        metadata: {
          ...data.metadata,
          lastSavedAt: Date.now(),
        },
      };
      await AsyncStorage.setItem(Config.storageKeys.SAVE_DATA, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error('[SaveService] Failed to save data:', error);
      return false;
    }
  }

  async load(): Promise<ISaveData | null> {
    try {
      const raw = await AsyncStorage.getItem(Config.storageKeys.SAVE_DATA);
      if (!raw) return null;
      return JSON.parse(raw) as ISaveData;
    } catch (error) {
      console.error('[SaveService] Failed to load save data:', error);
      return null;
    }
  }

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(Config.storageKeys.SAVE_DATA);
      return true;
    } catch (error) {
      console.error('[SaveService] Failed to clear save data:', error);
      return false;
    }
  }
}

export const saveService = new AsyncStorageSaveService();
