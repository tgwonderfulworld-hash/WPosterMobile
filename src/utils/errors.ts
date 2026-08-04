/**
 * Centralized error taxonomy. Every error surfaced to the UI passes through
 * `toAppError()` so it becomes one of a small set of kinds with a stable
 * i18n message key. Screens/Toasts translate `messageKey`; they never show raw
 * backend strings to the user.
 */
import { AxiosError } from 'axios';

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'rateLimited'
  | 'server'
  | 'unknown';

export interface FieldError {
  field: string;
  messageKey: string;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;
  /** i18n key, e.g. `errors.network`. */
  readonly messageKey: string;
  /** HTTP status when applicable. */
  readonly status?: number;
  /** Backend/domain code when applicable (e.g. Supabase error code). */
  readonly code?: string;
  /** Field-level errors for form validation. */
  readonly fields?: FieldError[];
  /** Original error for logging (never shown to users). */
  readonly cause?: unknown;

  constructor(init: {
    kind: AppErrorKind;
    messageKey?: string;
    status?: number;
    code?: string;
    fields?: FieldError[];
    cause?: unknown;
  }) {
    super(init.messageKey ?? `errors.${init.kind}`);
    this.name = 'AppError';
    this.kind = init.kind;
    this.messageKey = init.messageKey ?? `errors.${init.kind}`;
    this.status = init.status;
    this.code = init.code;
    this.fields = init.fields;
    this.cause = init.cause;
  }
}

const KIND_BY_STATUS: Record<number, AppErrorKind> = {
  400: 'validation',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  408: 'timeout',
  409: 'validation',
  422: 'validation',
  429: 'rateLimited',
};

function kindFromStatus(status: number): AppErrorKind {
  if (KIND_BY_STATUS[status]) return KIND_BY_STATUS[status];
  if (status >= 500) return 'server';
  return 'unknown';
}

/** Duck-typed shape of Supabase auth/postgrest errors. */
interface SupabaseLikeError {
  message: string;
  status?: number;
  code?: string;
  name?: string;
}

function isSupabaseError(e: unknown): e is SupabaseLikeError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    ('status' in e || 'code' in e || (e as { name?: string }).name === 'AuthApiError')
  );
}

/** Map well-known Supabase auth error codes/messages to friendly i18n keys. */
function supabaseMessageKey(err: SupabaseLikeError): { kind: AppErrorKind; messageKey: string } {
  const code = err.code ?? '';
  const msg = err.message?.toLowerCase() ?? '';

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return { kind: 'unauthorized', messageKey: 'errors.auth.invalidCredentials' };
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return { kind: 'forbidden', messageKey: 'errors.auth.emailNotConfirmed' };
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return { kind: 'validation', messageKey: 'errors.auth.emailTaken' };
  }
  if (code === 'weak_password' || msg.includes('password should be')) {
    return { kind: 'validation', messageKey: 'errors.auth.weakPassword' };
  }
  if (code === 'over_email_send_rate_limit' || err.status === 429) {
    return { kind: 'rateLimited', messageKey: 'errors.rateLimited' };
  }
  const kind = err.status ? kindFromStatus(err.status) : 'unknown';
  return { kind, messageKey: `errors.${kind}` };
}

/** Convert any thrown value into a normalized AppError. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return new AppError({ kind: 'timeout', cause: error });
    }
    if (error.message === 'Network Error' || !error.response) {
      return new AppError({ kind: 'network', cause: error });
    }
    const status = error.response.status;
    const kind = kindFromStatus(status);
    return new AppError({ kind, status, cause: error });
  }

  if (isSupabaseError(error)) {
    const { kind, messageKey } = supabaseMessageKey(error);
    return new AppError({ kind, messageKey, status: error.status, code: error.code, cause: error });
  }

  return new AppError({ kind: 'unknown', cause: error });
}
