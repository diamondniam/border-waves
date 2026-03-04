import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  prettier,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  {
    files: ['packages/core/**/*.ts'],
    rules: {
      'no-console': 'error',
    },
  },

  {
    ignores: ['dist', 'build', 'coverage', 'node_modules'],
  },
]
