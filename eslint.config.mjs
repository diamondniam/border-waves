import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  prettier,

  // CORE
  {
    files: ['packages/core/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./packages/core/tsconfig.json'],
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // PLAYGROUND-REACT
  {
    files: ['packages/playground-react/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./packages/playground-react/tsconfig.eslint.json'],
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/*.d.cts',
      '**/node_modules/**',
    ],
  },
]
