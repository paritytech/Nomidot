module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'semistandard',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.json'
    ]
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // Disable prop-types, because we already have TS
    "react/prop-types": "off",
    // Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};