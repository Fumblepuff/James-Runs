module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb',
  ],
  parser: 'babel-eslint',
  plugins: [
    'react',
    'react-native',
    'jsx-a11y',
  ],
  parserOptions: {
    ecmaFeatures: {
        jsx: true,
        modules: true
    }
  },
  "ignorePatterns": ["**/src/theme/*"],
  globals: {
    "performance": false,
  },
  rules: {
    'prettier/prettier': 0,
    "import/no-unresolved": "off",
    "class-methods-use-this": ["off"],
    "react/jsx-props-no-spreading": ["off"],
    'no-underscore-dangle': ['error', {
      allow: ['_root'],
      allowAfterThis: false,
      allowAfterSuper: false,
      enforceInMethodNames: true,
    }],
    "max-len": ["error", { "code": 170 }],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxBOF": 1, "maxEOF": 0 }],
    "react/jsx-filename-extension": ["off"],
    "react/prop-types": ["error", {
      "ignore": [
          "navigation",
      ]
    }],
    'react/forbid-prop-types': ['error', {
      forbid: ['any'],
      checkContextTypes: true,
      checkChildContextTypes: true,
    }],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true, "argsIgnorePattern": "^_" }],
  },
};
