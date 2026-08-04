import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Checkbox, Input, PasswordInput } from '@/components/ui';
import {
  AuthFooterLink,
  AuthScreenLayout,
  registerSchema,
  useRegister,
  type RegisterValues,
} from '@/features/auth';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const register = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', agreement: false },
  });

  const onSubmit = handleSubmit((values) => register.mutate(values));

  return (
    <AuthScreenLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <AuthFooterLink
          prompt={t('auth.register.haveAccount')}
          action={t('auth.register.signIn')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.register.namePlaceholder')}
            placeholder={t('auth.register.namePlaceholder')}
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t('common.password')}
            placeholder={t('auth.login.passwordPlaceholder')}
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
            placeholder={t('auth.register.confirmPlaceholder')}
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
            label={t('auth.register.agreement')}
            error={!!errors.agreement}
          />
        )}
      />

      <Button
        label={t('auth.register.submit')}
        onPress={onSubmit}
        loading={register.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
