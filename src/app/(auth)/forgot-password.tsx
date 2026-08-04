import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Input } from '@/components/ui';
import {
  AuthFooterLink,
  AuthScreenLayout,
  forgotPasswordSchema,
  useForgotPassword,
  type ForgotPasswordValues,
} from '@/features/auth';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const forgot = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => forgot.mutate(values));

  return (
    <AuthScreenLayout
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      footer={
        <AuthFooterLink
          prompt=""
          action={t('auth.forgot.backToLogin')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      {forgot.isSuccess ? <Alert tone="success" message={t('auth.forgot.sent')} /> : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('common.email')}
            placeholder={t('auth.login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email ? t(errors.email.message!) : undefined}
          />
        )}
      />

      <Button
        label={t('auth.forgot.submit')}
        onPress={onSubmit}
        loading={forgot.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
