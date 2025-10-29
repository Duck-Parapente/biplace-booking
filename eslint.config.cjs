// Flat ESLint config (v9) scoped to apps/ only; ignores generated/build dirs.
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const vuePlugin = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');

const importOrderRule = [
  'warn',
  {
    'newlines-between': 'always',
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

module.exports = [
  {
    ignores: ['**/dist/**', 'node_modules/**', '**/.nuxt/**'],
  },
  // JS in apps
  {
    files: ['apps/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'error',
      'import/order': importOrderRule,
    },
  },
  // TypeScript in apps
  {
    files: ['apps/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'error',
      'import/order': importOrderRule,
    },
  },
  // Vue single-file components
  {
    files: ['apps/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // minimal commonly used Vue rules (no extends)
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/require-v-for-key': 'warn',
      'vue/multi-word-component-names': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/order': importOrderRule,
    },
  },
  // Root helper/config files (prevent VSCode "Could not find config" errors)
  {
    files: ['*.{js,cjs}', 'lint-staged.config.js', 'eslint.config.cjs'],
    rules: {},
  },
];
