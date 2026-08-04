/**
 * Axios instance for the WPoster REST API (Next.js routes / Supabase Edge
 * Functions) — everything beyond Supabase's own SDK calls.
 *
 * Interceptors:
 *  - Request: attach the live Supabase access token + anon apikey.
 *  - Response: on 401, transparently refresh the Supabase session once and retry
 *    the original request, so an expired access token never surfaces to the user.
 *    All errors are normalized via `toAppError`.
 */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { config } from '@/constants/config';
import { supabase } from '@/services/supabase';
import { toAppError } from '@/utils/errors';
import { logger } from '@/utils/logger';

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (request) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  request.headers.set('apikey', config.supabaseAnonKey);
  if (session?.access_token) {
    request.headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  return request;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && data.session?.access_token) {
        original.headers.set('Authorization', `Bearer ${data.session.access_token}`);
        return api(original);
      }
      logger.warn('api', 'Token refresh failed after 401; signing out.');
      await supabase.auth.signOut();
    }

    return Promise.reject(toAppError(error));
  },
);
