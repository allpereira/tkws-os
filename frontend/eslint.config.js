import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

/**
 * ESLint flat config (v9). Cobre o app React + TypeScript.
 *
 * Regras alinhadas aos princípios do projeto (ver CLAUDE.md):
 *  - `no-explicit-any` como erro — princípio "nunca usar any" (use unknown + refine).
 *  - hooks do React validados (rules-of-hooks + exhaustive-deps).
 */
export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'node_modules', '*.config.js', '*.config.ts', 'playwright.config.ts'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Dica de HMR apenas (arquivos que exportam componente + helper). Desligada
      // por ser ruído em route-trees e exports idiomáticos de `*Variants`.
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // `components/` espelha o design system (ver components/README.md · "DS → Frontend
    // é espelho"). Primitivos vendorizados do shadcn/DS usam `any` pontualmente; o
    // princípio "nunca any" vale para o código de produto (modules/, lib/, app/).
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Testes podem usar utilitários e padrões mais relaxados.
    files: ['**/__tests__/**', '**/*.test.{ts,tsx}', 'src/test/**', 'e2e/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
