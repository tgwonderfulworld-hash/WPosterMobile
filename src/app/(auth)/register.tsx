import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Checkbox, Input, PasswordInput } from '@/components/ui';
import {
  AuthFooterLink,
  AuthScreenLayout,
  registerSchema,
  TurnstileCaptcha,
  useRegister,
  type RegisterValues,
} from '@/features/auth';
import { useTranslations } from '@/i18n';

export default function RegisterScreen() {
  const t = useTranslations();
  const register = useRegister();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', agreement: false },
  });

  const onSubmit = handleSubmit((values) => {
    if (!captchaToken) return;
    register.mutate({ ...values, captchaToken });
  });

  return (
    <AuthScreenLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <AuthFooterLink
          prompt={t('auth.register.switchText')}
          action={t('auth.register.switchLink')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('mobile.fields.name')}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon="person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name ? t(errors.name.message!) : undefined}
          />
        )}
      />

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

      <Controller
        control={control}
        name="agreement"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={value}
            onChange={onChange}
            label={t('mobile.fields.agreement')}
            error={!!errors.agreement}
          />
        )}
      />

      <TurnstileCaptcha onToken={setCaptchaToken} />

      <Button
        label={register.isPending ? t('auth.register.submittingButton') : t('auth.register.submitButton')}
        onPress={onSubmit}
        loading={register.isPending}
        disabled={!captchaToken}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
