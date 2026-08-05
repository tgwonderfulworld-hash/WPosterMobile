/**
 * Auth form schemas (Zod). Error messages are i18n KEYS (e.g. `validation.email`)
 * — screens translate them with `t()` at render time so validation is localized.
 */
import { z } from 'zod';

const email = z.string().trim().min(1, 'mobile.validation.required').email('mobile.validation.email');

const strongPassword = z
  .string()
  .min(8, 'mobile.validation.passwordMin')
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'mobile.validation.passwordComplexity');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'mobile.validation.required'),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'mobile.validation.required'),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, 'mobile.validation.required'),
    agreement: z.boolean().refine((v) => v === true, { message: 'mobile.validation.agreementRequired' }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'mobile.validation.passwordsMismatch',
    path: ['confirmPassword'],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'mobile.validation.required'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'mobile.validation.passwordsMismatch',
    path: ['confirmPassword'],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
