import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';

import { Alert, Button, Input } from '@/components/ui';
import {
  AuthFooterLink,
  AuthScreenLayout,
  forgotPasswordSchema,
  useForgotPassword,
  type ForgotPasswordValues,
} from '@/features/auth';
import { useTranslations } from '@/i18n';

export default function ForgotPasswordScreen() {
  const t = useTranslations();
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
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      footer={
        <AuthFooterLink
          prompt={t('auth.forgotPassword.switchText')}
          action={t('auth.forgotPassword.switchLink')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      {forgot.isSuccess ? <Alert tone="success" message={t('mobile.notices.resetLinkSent')} /> : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('mobile.fields.email')}
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
        label={forgot.isPending ? t('auth.forgotPassword.submittingButton') : t('auth.forgotPassword.submitButton')}
        onPress={onSubmit}
        loading={forgot.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
