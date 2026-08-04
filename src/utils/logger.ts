/**
 * Lightweight logger. In production, debug/info are suppressed; warn/error are
 * kept and routed through a pluggable sink (wire Sentry here later). Never logs
 * secrets — callers are responsible for not passing tokens/passwords.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogSink {
  captureException?(error: unknown, context?: Record<string, unknown>): void;
  captureMessage?(message: string, level: LogLevel): void;
}

let sink: LogSink | null = null;

/** Register an external sink (e.g. Sentry) once at app startup. */
export function setLogSink(next: LogSink): void {
  sink = next;
}

const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

function format(scope: string, args: unknown[]): unknown[] {
  return [`[WPoster:${scope}]`, ...args];
}

export const logger = {
  debug(scope: string, ...args: unknown[]): void {
    if (isDev) console.log(...format(scope, args));
  },
  info(scope: string, ...args: unknown[]): void {
    if (isDev) console.info(...format(scope, args));
    sink?.captureMessage?.(`${scope}: ${String(args[0] ?? '')}`, 'info');
  },
  warn(scope: string, ...args: unknown[]): void {
    if (isDev) console.warn(...format(scope, args));
    sink?.captureMessage?.(`${scope}: ${String(args[0] ?? '')}`, 'warn');
  },
  error(scope: string, error: unknown, context?: Record<string, unknown>): void {
    if (isDev) console.error(...format(scope, [error, context ?? '']));
    sink?.captureException?.(error, { scope, ...context });
  },
};
