/**
 * LargeSecureStore — the storage adapter Supabase Auth uses to persist the
 * session (access + refresh tokens).
 *
 * Why not raw SecureStore? On iOS the Keychain rejects values above ~2048 bytes,
 * and Supabase sessions (JWT + refresh token + user) routinely exceed that. The
 * Supabase-recommended pattern for React Native is:
 *
 *   1. Generate a random AES-256 key per stored value.
 *   2. Encrypt the value (AES-CTR) and store the CIPHERTEXT in fast storage (MMKV).
 *   3. Store only the small AES key in SecureStore (Keychain / Android Keystore).
 *
 * The ciphertext is useless without the key, so the sensitive material is still
 * protected by the OS secure enclave, while the large payload lives in MMKV.
 */
import aesjs from 'aes-js';
import * as Crypto from 'expo-crypto';

import { logger } from '@/utils/logger';

import { mmkv } from './mmkv';
import { secureStorage } from './secure';

// AES-CTR with a per-value 256-bit key. A fixed counter is fine because each
// value gets a fresh random key (never reused across encryptions).
function encrypt(value: string): { keyHex: string; cipherHex: string } {
  const key = Crypto.getRandomBytes(32);
  const cipher = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1));
  const cipherBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
  return {
    keyHex: aesjs.utils.hex.fromBytes(key),
    cipherHex: aesjs.utils.hex.fromBytes(cipherBytes),
  };
}

function decrypt(keyHex: string, cipherHex: string): string {
  const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(keyHex), new aesjs.Counter(1));
  const plainBytes = cipher.decrypt(aesjs.utils.hex.toBytes(cipherHex));
  return aesjs.utils.utf8.fromBytes(plainBytes);
}

export class LargeSecureStore {
  async getItem(key: string): Promise<string | null> {
    try {
      const cipherHex = mmkv.getString(key);
      if (!cipherHex) return null;
      const keyHex = await secureStorage.get(key);
      if (!keyHex) return null;
      return decrypt(keyHex, cipherHex);
    } catch (error) {
      logger.error('LargeSecureStore.getItem', error, { key });
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const { keyHex, cipherHex } = encrypt(value);
      await secureStorage.set(key, keyHex);
      mmkv.set(key, cipherHex);
    } catch (error) {
      logger.error('LargeSecureStore.setItem', error, { key });
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      mmkv.remove(key);
      await secureStorage.remove(key);
    } catch (error) {
      logger.error('LargeSecureStore.removeItem', error, { key });
    }
  }
}

export const largeSecureStore = new LargeSecureStore();
