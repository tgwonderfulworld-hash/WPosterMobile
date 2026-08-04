/**
 * Auth form schemas (Zod). Error messages are i18n KEYS (e.g. `validation.email`)
 * — screens translate them with `t()` at render time so validation is localized.
 */
import { z } from 'zod';

const email = z.string().trim().min(1, 'validation.required').email('validation.email');

const strongPassword = z
  .string()
  .min(8, 'validation.passwordMin')
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'validation.passwordComplexity');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation.required'),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'validation.required'),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, 'validation.required'),
    agreement: z.boolean().refine((v) => v === true, { message: 'validation.agreementRequired' }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
