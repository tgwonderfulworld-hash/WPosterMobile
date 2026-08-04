import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppError } from '@/utils/errors';
import { useTheme } from '@/theme';

import { Button } from './Button';
import { Text } from './Text';

export interface ErrorStateProps {
  /** An AppError (its messageKey is translated) or a raw translated string. */
  error?: AppError | string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const message =
    error instanceof AppError ? t(error.messageKey) : (error ?? t('states.errorBody'));

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.dangerSubtle }]}>
        <Ionicons name="cloud-offline-outline" size={30} color={theme.colors.danger} />
      </View>
      <Text variant="subtitle" align="center">
        {t('states.errorTitle')}
      </Text>
      <Text variant="body" color="muted" align="center" style={styles.body}>
        {message}
      </Text>
      {onRetry ? <Button label={t('common.retry')} onPress={onRetry} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  iconWrap: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  body: { maxWidth: 300 },
  action: { marginTop: 8 },
});
