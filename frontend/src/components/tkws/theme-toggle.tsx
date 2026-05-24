import { useTheme } from '@/shared/store/theme'
import { cn } from '@/lib/utils'

/**
 * ThemeToggle · segmented control "Dark · Light" no estilo TKWS OS.
 *
 * Fiel a `design-system/src/components/docs/ThemeToggle.tsx`. Persiste
 * a escolha em localStorage via `useTheme` (zustand persist).
 *
 * Uso típico no AppShell footer ou na topbar.
 */

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={cn('inline-flex items-center gap-px rounded-full border p-[3px]', className)}
      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
      role="group"
      aria-label="Tema"
    >
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className="mono cursor-pointer rounded-full border-0 px-[10px] py-[5px] text-[9.5px] font-bold uppercase tracking-wider transition-all"
        style={{
          background: theme === 'dark' ? 'var(--brand)' : 'transparent',
          color: theme === 'dark' ? 'var(--bg)' : 'var(--text-mute)',
        }}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className="mono cursor-pointer rounded-full border-0 px-[10px] py-[5px] text-[9.5px] font-bold uppercase tracking-wider transition-all"
        style={{
          background: theme === 'light' ? 'var(--brand)' : 'transparent',
          color: theme === 'light' ? 'var(--bg)' : 'var(--text-mute)',
        }}
      >
        Light
      </button>
    </div>
  )
}
