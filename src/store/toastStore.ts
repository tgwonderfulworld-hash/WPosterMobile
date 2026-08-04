/**
 * Imperative toast queue. UI is rendered by <ToastHost/>; anywhere in the app
 * you call `toast.success(...)` / `toast.error(...)`. Messages may be plain
 * strings or i18n keys (the host translates keys).
 */
import { create } from 'zustand';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, variant?: ToastVariant, durationMs?: number) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let counter = 0;
const nextId = () => `toast-${Date.now()}-${counter++}`;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = 'info', durationMs = 3500) => {
    const id = nextId();
    set((s) => ({ toasts: [...s.toasts, { id, message, variant, durationMs }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/** Non-hook helper usable from anywhere (services, error handlers). */
export const toast = {
  show: (message: string, variant?: ToastVariant, durationMs?: number) =>
    useToastStore.getState().show(message, variant, durationMs),
  success: (message: string, durationMs?: number) =>
    useToastStore.getState().show(message, 'success', durationMs),
  info: (message: string, durationMs?: number) =>
    useToastStore.getState().show(message, 'info', durationMs),
  warning: (message: string, durationMs?: number) =>
    useToastStore.getState().show(message, 'warning', durationMs),
  error: (message: string, durationMs?: number) =>
    useToastStore.getState().show(message, 'error', durationMs),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
