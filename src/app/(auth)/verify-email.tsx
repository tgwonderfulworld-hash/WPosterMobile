import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { AuthFooterLink, AuthScreenLayout, useResendVerification } from '@/features/auth';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const resend = useResendVerification();

  return (
    <AuthScreenLayout
      title={t('auth.verify.title')}
      subtitle={t('auth.verify.subtitle', { email: email ?? t('common.email').toLowerCase() })}
      footer={
        <AuthFooterLink
          prompt=""
          action={t('auth.verify.backToLogin')}
          onPress={() => router.replace('/login')}
        />
      }
    >
      <Button
        label={t('auth.verify.resend')}
        variant="secondary"
        onPress={() => email && resend.mutate(email)}
        loading={resend.isPending}
        disabled={!email}
        fullWidth
      />
    </AuthScreenLayout>
  );
}
