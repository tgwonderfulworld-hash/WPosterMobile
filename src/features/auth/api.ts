/**
 * Auth API — thin, typed wrappers over Supabase Auth. Every call throws a
 * normalized AppError on failure (never a raw Supabase error). No mocks: these
 * hit the live WPoster Supabase project.
 */
import * as Linking from 'expo-linking';

import { supabase } from '@/services/supabase';
import { toAppError } from '@/utils/errors';

/** Deep link the backend redirects to after email actions. */
function redirectTo(path: string): string {
  return Linking.createURL(path);
}

export const authApi = {
  // captchaToken is required — Supabase Auth on this project has captcha
  // protection enabled for signIn/signUp/resetPassword (same as Web, which
  // supplies it via Cloudflare Turnstile); omitting it fails every call with
  // error.code === 'captcha_failed'.
  async signIn(email: string, password: string, captchaToken: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });
    if (error) throw toAppError(error);
    return data;
  },

  async signUp(name: string, email: string, password: string, captchaToken: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: redirectTo('/verify-email'),
        captchaToken,
      },
    });
    if (error) throw toAppError(error);
    return data;
  },

  async sendPasswordReset(email: string, captchaToken: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo('/reset-password'),
      captchaToken,
    });
    if (error) throw toAppError(error);
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw toAppError(error);
    return data;
  },

  async resendVerification(email: string) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw toAppError(error);
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw toAppError(error);
  },
};
