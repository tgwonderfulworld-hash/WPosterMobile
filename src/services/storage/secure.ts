/**
 * Thin wrapper over expo-secure-store for small sensitive values (encryption
 * keys, and any short-lived secret). Tokens themselves are handled by Supabase
 * via the LargeSecureStore adapter.
 */
import * as SecureStore from 'expo-secure-store';

import { logger } from '@/utils/logger';

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error('secureStorage.get', error, { key });
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error('secureStorage.set', error, { key });
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('secureStorage.remove', error, { key });
    }
  },
};
