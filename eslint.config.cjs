// eslint.config.cjs;
// ESLint 9.26 flat‐config for an Expo monorepo
const parser = require('@typescript-eslint/parser');
const eslintJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier/flat');
const prettierPlugin = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');

module.exports = tseslint.config(
  // A) Ignore build/output and deps
  {
    ignores: [
      // Config files
      'eslint.config.cjs',
      'tsconfig.json',
      'tailwind.config.js',
      // Expo files
      'expo-env.d.ts',
      '.expo/**',
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      'expo.config.js',
      'app.config.js',
      // JEST
      'jest.config.js',
      'jest-puppeteer.config.js',
      'tests/**',
      // Other folders
      'node_modules/**',
      'dist/**',
      'build/**',
      'web-dist-next-rv5/**',
    ],
  },

  // B) Prettier-first so it can turn off rules
  prettierConfig,

  // C) Enforce Prettier via plugin
  prettierPlugin,

  // D) ESLint’s recommended JS rules
  eslintJs.configs.recommended,

  // E) TS plugin’s recommended rules
  tseslint.configs.recommended,

  // F) React‐ecosystem recommended rules
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksPlugin.configs['recommended-latest'],
  jsxA11yPlugin.flatConfigs.recommended,

  // G) Your custom parser settings + rule overrides
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React to use
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parser, // @typescript-eslint/parser
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname, // ensure it's resolved from repo root
      },
    },
    rules: {
      // From base.json
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      eqeqeq: 'off',
      'import/no-unresolved': 'off',
      'prettier/prettier': ['warn', { endOfLine: 'auto', singleQuote: true }],

      // From react.json
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
