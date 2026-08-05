import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { Text } from '@/components/ui';
import { config } from '@/constants/config';
import { useTranslations } from '@/i18n';

export interface TurnstileCaptchaProps {
  /** Fired with the verification token once the challenge succeeds, or `null`
   * when it errors/expires (callers should treat submit as blocked until the
   * next non-null token). */
  onToken: (token: string | null) => void;
}

/**
 * Same Cloudflare Turnstile widget WPoster Web renders (`sitekey`, `theme`,
 * `response-field: false`, explicit render) — no separate captcha scheme.
 * Turnstile has no React Native SDK, so the actual widget runs inside a
 * WebView loading a small self-contained HTML page; `baseUrl` is set to the
 * real wposter.app origin so Cloudflare's hostname allowlist for this site
 * key passes exactly as it would for a Web pageload.
 */
function buildHtml(siteKey: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
      body { display: flex; align-items: center; justify-content: center; }
    </style>
  </head>
  <body>
    <div id="cf-turnstile"></div>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
    <script>
      function post(payload) { window.ReactNativeWebView.postMessage(JSON.stringify(payload)); }
      function renderWidget() {
        window.turnstile.render('#cf-turnstile', {
          sitekey: '${siteKey}',
          theme: 'dark',
          'response-field': false,
          callback: function (token) { post({ type: 'token', token: token }); },
          'error-callback': function () { post({ type: 'error' }); },
          'expired-callback': function () { post({ type: 'expired' }); }
        });
      }
      var poll = setInterval(function () {
        if (window.turnstile) { clearInterval(poll); renderWidget(); }
      }, 100);
    </script>
  </body>
</html>`;
}

export function TurnstileCaptcha({ onToken }: TurnstileCaptchaProps) {
  const t = useTranslations();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const html = useMemo(() => buildHtml(config.turnstileSiteKey), []);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let payload: { type: string; token?: string };
      try {
        payload = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }
      if (payload.type === 'token' && payload.token) {
        setStatus('ready');
        onToken(payload.token);
      } else if (payload.type === 'error') {
        setStatus('error');
        onToken(null);
      } else if (payload.type === 'expired') {
        setStatus('loading');
        onToken(null);
      }
    },
    [onToken],
  );

  if (!config.turnstileSiteKey) return null;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://wposter.app' }}
        onMessage={handleMessage}
        onError={() => setStatus('error')}
        style={styles.webview}
        containerStyle={styles.webviewContainer}
        javaScriptEnabled
        scrollEnabled={false}
      />
      {status === 'error' ? (
        <Text variant="caption" color="danger" style={styles.errorText}>
          {t('auth.errors.captchaLoadFailed')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6 },
  webview: { width: 300, height: 70, backgroundColor: 'transparent' },
  webviewContainer: { backgroundColor: 'transparent' },
  errorText: { marginTop: 2 },
});
