/**
 * Auth mutations (React Query). Success/failure feedback goes through the global
 * toast (which translates i18n message keys). Navigation on success is driven by
 * the route guards reacting to the auth store, except for flows that need an
 * explicit next screen (register → verify email, reset → login).
 */
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { toast } from '@/store';
import { AppError } from '@/utils/errors';

import { authApi } from './api';
import type {
  ForgotPasswordValues,
  LoginValues,
  RegisterValues,
  ResetPasswordValues,
} from './schemas';

function notifyError(error: unknown): void {
  const messageKey = error instanceof AppError ? error.messageKey : 'errors.unknown';
  toast.error(messageKey);
}

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginValues & { captchaToken: string }) =>
      authApi.signIn(values.email, values.password, values.captchaToken),
    onError: (error) => {
      if (error instanceof AppError && error.messageKey === 'errors.auth.emailNotConfirmed') {
        router.push('/verify-email');
      }
      notifyError(error);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterValues & { captchaToken: string }) =>
      authApi.signUp(values.name, values.email, values.password, values.captchaToken),
    onSuccess: (data, variables) => {
      // With email confirmation enabled, there's no session yet — send the user
      // to the verify-email screen. Otherwise the guard will route to the app.
      if (!data.session) {
        toast.success('auth.register.checkEmailTitle');
        router.push({ pathname: '/verify-email', params: { email: variables.email } });
      }
    },
    onError: notifyError,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordValues & { captchaToken: string }) =>
      authApi.sendPasswordReset(values.email, values.captchaToken),
    onSuccess: () => toast.success('mobile.notices.resetLinkSent'),
    onError: notifyError,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (values: ResetPasswordValues) => authApi.updatePassword(values.password),
    onSuccess: () => {
      toast.success('mobile.notices.passwordUpdated');
      router.replace('/login');
    },
    onError: notifyError,
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => toast.success('auth.register.resendSuccess'),
    onError: notifyError,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.signOut(),
    onError: notifyError,
  });
}
