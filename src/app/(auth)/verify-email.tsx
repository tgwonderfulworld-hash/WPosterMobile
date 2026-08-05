import { router, useLocalSearchParams } from 'expo-router';

import { Button, Text } from '@/components/ui';
import { AuthFooterLink, AuthScreenLayout, useResendVerification } from '@/features/auth';
import { useTranslations } from '@/i18n';

export default function VerifyEmailScreen() {
  const t = useTranslations();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const resend = useResendVerification();

  return (
    <AuthScreenLayout
      title={t('auth.register.checkEmailTitle')}
      subtitle={t('auth.register.checkEmailDesc')}
      footer={
        <AuthFooterLink
          prompt=""
          action={t('auth.forgotPassword.switchLink')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      {email ? (
        <Text variant="subtitle" align="center">
          {email}
        </Text>
      ) : null}

      <Text variant="small" color="muted" align="center">
        {t('auth.register.checkEmailHelp')}
      </Text>

      <Button
        label={t('auth.register.resendButton')}
        variant="secondary"
        onPress={() => email && resend.mutate(email)}
        loading={resend.isPending}
        disabled={!email}
        fullWidth
      />

      <Text variant="caption" color="subtle" align="center">
        {t('auth.register.spamHint')}
      </Text>
    </AuthScreenLayout>
  );
}
