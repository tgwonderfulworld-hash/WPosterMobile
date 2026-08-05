import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, PasswordInput } from '@/components/ui';
import {
  AuthScreenLayout,
  resetPasswordSchema,
  useResetPassword,
  type ResetPasswordValues,
} from '@/features/auth';
import { useTranslations } from '@/i18n';

export default function ResetPasswordScreen() {
  const t = useTranslations();
  const reset = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => reset.mutate(values));

  return (
    <AuthScreenLayout title={t('auth.updatePassword.title')} subtitle={t('auth.updatePassword.subtitle')}>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('mobile.fields.password')}
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password ? t(errors.password.message!) : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('mobile.fields.confirmPassword')}
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword ? t(errors.confirmPassword.message!) : undefined}
          />
        )}
      />

      <Button
        label={reset.isPending ? t('auth.updatePassword.submittingButton') : t('auth.updatePassword.submitButton')}
        onPress={onSubmit}
        loading={reset.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
