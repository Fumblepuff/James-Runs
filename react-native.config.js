module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    '@invertase/react-native-apple-authentication': {
      platforms: {
        android: null, // disable Android platform
      },
    },
  },
  assets: ['./src/assets/fonts'],
};
