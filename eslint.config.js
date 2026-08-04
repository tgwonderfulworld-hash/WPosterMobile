// ESLint flat config for Expo SDK 57 (TypeScript strict).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    rules: {
      // False positives for default imports that also expose named exports
      // (i18next's `use`/`changeLanguage`, axios's `create`).
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'android/*', 'ios/*'],
  },
];
