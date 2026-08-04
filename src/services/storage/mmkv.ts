/**
 * Fast, synchronous key-value storage (MMKV) for NON-sensitive persisted state:
 * theme preference, language, onboarding flags, and the encrypted session blob
 * (ciphertext only — the AES key lives in SecureStore; see largeSecureStore.ts).
 *
 * We deliberately do NOT use AsyncStorage anywhere (per spec).
 */
import { createMMKV } from 'react-native-mmkv';

// react-native-mmkv v4 (Nitro) creates instances via a factory, not `new MMKV`.
export const mmkv = createMMKV({ id: 'wposter.app' });

/** JSON helpers with safe parsing. */
export const kv = {
  getString(key: string): string | undefined {
    return mmkv.getString(key);
  },
  setString(key: string, value: string): void {
    mmkv.set(key, value);
  },
  getObject<T>(key: string): T | null {
    const raw = mmkv.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject(key: string, value: unknown): void {
    mmkv.set(key, JSON.stringify(value));
  },
  delete(key: string): void {
    mmkv.remove(key);
  },
  clearAll(): void {
    mmkv.clearAll();
  },
};

/**
 * Zustand-compatible storage adapter backed by MMKV (for `persist` middleware).
 */
export const zustandMmkvStorage = {
  getItem: (name: string): string | null => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string): void => mmkv.set(name, value),
  removeItem: (name: string): void => {
    mmkv.remove(name);
  },
};
