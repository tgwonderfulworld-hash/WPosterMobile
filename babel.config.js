// Babel config for Expo SDK 57 + NativeWind v4.
//
// NOTE: The Reanimated/Worklets Babel plugin is added automatically by
// `babel-preset-expo` when `react-native-worklets` is installed, so we must
// NOT add `react-native-worklets/plugin` here (doing so throws a duplicate
// plugin error). See babel-preset-expo/build/configs/expo.js.
module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
