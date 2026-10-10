const reactNativePreset = require('@react-native/jest-preset');

module.exports = {
  ...reactNativePreset,
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-vector-icons|@react-navigation)\\/',
  ],
  setupFiles: [
    ...reactNativePreset.setupFiles,
    require.resolve('react-native-gesture-handler/jestSetup.js'),
  ],
};
