import { useTheme } from '@/store/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-px rounded-full border p-[3px]"
         style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'cursor-pointer rounded-full border-0 px-[10px] py-[5px] mono text-[9.5px] font-bold tracking-wider uppercase transition-all',
          theme === 'dark' ? 'text-bg' : 'text-text-mute hover:text-text-soft'
        )}
        style={{
          background: theme === 'dark' ? 'var(--brand)' : 'transparent',
          color: theme === 'dark' ? 'var(--bg)' : 'var(--text-mute)',
        }}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme('light')}
        className="cursor-pointer rounded-full border-0 px-[10px] py-[5px] mono text-[9.5px] font-bold tracking-wider uppercase transition-all"
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
