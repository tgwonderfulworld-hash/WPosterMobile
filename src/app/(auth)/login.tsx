import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button, Checkbox, Input, PasswordInput, Text } from '@/components/ui';
import { AuthFooterLink, AuthScreenLayout, loginSchema, useLogin, type LoginValues } from '@/features/auth';
import { useTheme } from '@/theme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <AuthScreenLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      footer={
        <AuthFooterLink
          prompt={t('auth.login.noAccount')}
          action={t('auth.login.createAccount')}
          onPress={() => router.push('/register')}
        />
      }
    >
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
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password ? t(errors.password.message!) : undefined}
          />
        )}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Controller
          control={control}
          name="remember"
          render={({ field: { onChange, value } }) => (
            <Checkbox checked={value} onChange={onChange} label={t('auth.login.rememberMe')} />
          )}
        />
        <Pressable onPress={() => router.push('/forgot-password')} hitSlop={8}>
          <Text variant="bodyStrong" style={{ color: theme.colors.primary }}>
            {t('auth.login.forgot')}
          </Text>
        </Pressable>
      </View>

      <Button
        label={t('auth.login.submit')}
        onPress={onSubmit}
        loading={login.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
