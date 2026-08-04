import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/BrandMark';
import { PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Optional footer row (e.g. "Don't have an account? Create one"). */
  footer?: ReactNode;
  showBrand?: boolean;
}

/** Consistent, branded scaffold for every auth screen. */
export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  showBrand = true,
}: AuthScreenLayoutProps) {
  const theme = useTheme();
  return (
    <SafeAreaContainer>
      <PageContainer keyboardAvoiding>
        <View style={styles.header}>
          {showBrand ? <BrandMark size={64} /> : null}
          <Text variant="heading" align="center" style={{ marginTop: theme.spacing.lg }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="body" color="muted" align="center" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.form}>{children}</View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </PageContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 28 },
  subtitle: { marginTop: 8, maxWidth: 320 },
  form: { gap: 16 },
  footer: { marginTop: 28, alignItems: 'center' },
});
