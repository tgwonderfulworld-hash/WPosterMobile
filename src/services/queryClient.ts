/**
 * React Query client. Retry policy is error-aware (never retry auth/validation
 * errors), with sane cache/stale times for a mobile SaaS. Online/offline is
 * handled globally by the NetInfo listener, which pauses/resumes queries.
 */
import { QueryClient } from '@tanstack/react-query';

import { AppError } from '@/utils/errors';

const NON_RETRYABLE: ReadonlySet<string> = new Set([
  'unauthorized',
  'forbidden',
  'notFound',
  'validation',
  'rateLimited',
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (error instanceof AppError && NON_RETRYABLE.has(error.kind)) return false;
        return failureCount < 2;
      },
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
