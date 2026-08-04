import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, PasswordInput } from '@/components/ui';
import {
  AuthScreenLayout,
  resetPasswordSchema,
  useResetPassword,
  type ResetPasswordValues,
} from '@/features/auth';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
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
    <AuthScreenLayout title={t('auth.reset.title')} subtitle={t('auth.reset.subtitle')}>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('common.password')}
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
            label={t('auth.register.confirmPlaceholder')}
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword ? t(errors.confirmPassword.message!) : undefined}
          />
        )}
      />

      <Button
        label={t('auth.reset.submit')}
        onPress={onSubmit}
        loading={reset.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
