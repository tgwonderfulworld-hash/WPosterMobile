import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { Button, Checkbox, Input, PasswordInput, Text } from '@/components/ui';
import { AuthFooterLink, AuthScreenLayout, loginSchema, useLogin, type LoginValues } from '@/features/auth';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

export default function LoginScreen() {
  const t = useTranslations();
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
          prompt={t('auth.login.switchText')}
          action={t('auth.login.switchLink')}
          onPress={() => router.push('/register')}
        />
      }
    >
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
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password ? t(errors.password.message!) : undefined}
          />
        )}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Controller
          control={control}
          name="remember"
          render={({ field: { onChange, value } }) => (
            <Checkbox checked={value} onChange={onChange} label={t('mobile.fields.rememberMe')} />
          )}
        />
        <Pressable onPress={() => router.push('/forgot-password')} hitSlop={8} style={{ flexShrink: 0 }}>
          <Text variant="bodyStrong" numberOfLines={1} style={{ color: theme.colors.primary }}>
            {t('auth.login.forgotPasswordLink')}
          </Text>
        </Pressable>
      </View>

      <Button
        label={login.isPending ? t('auth.login.submittingButton') : t('auth.login.submitButton')}
        onPress={onSubmit}
        loading={login.isPending}
        fullWidth
        style={{ marginTop: 4 }}
      />
    </AuthScreenLayout>
  );
}
