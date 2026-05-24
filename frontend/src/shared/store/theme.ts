import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * useTheme · store de tema do TKWS OS.
 *
 * Espelho fiel de `design-system/src/store/theme.ts`. Persiste a escolha
 * do usuário em localStorage (`tkws-theme`) e sincroniza com
 * `<html data-theme="dark|light">`.
 *
 * O setup inicial (`applyInitialTheme`) é chamado em `main.tsx` antes do
 * React montar, para evitar flash do tema errado (FOUC).
 */

export type Theme = 'dark' | 'light'

type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        set({ theme: next })
      },
    }),
    {
      name: 'tkws-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      },
    },
  ),
)

/**
 * Lê localStorage e aplica `data-theme` no `<html>` antes do React montar.
 * Evita flash do tema padrão (dark) quando o usuário tem light salvo.
 *
 * Chamado uma única vez no topo de `main.tsx`.
 */
export function applyInitialTheme() {
  try {
    const stored = window.localStorage.getItem('tkws-theme')
    if (!stored) {
      document.documentElement.setAttribute('data-theme', 'dark')
      return
    }
    const parsed = JSON.parse(stored) as { state?: { theme?: Theme } }
    const theme = parsed?.state?.theme === 'light' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
}
