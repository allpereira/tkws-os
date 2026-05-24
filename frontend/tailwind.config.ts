import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // TKWS brand tokens (CSS vars, sem hsl wrap)
        bg: 'var(--bg)',
        canvas: 'var(--canvas)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'surface-4': 'var(--surface-4)',
        brand: {
          DEFAULT: 'var(--brand)',
          h: 'var(--brand-h)',
          p: 'var(--brand-p)',
          soft: 'var(--brand-soft)',
        },
        text: {
          DEFAULT: 'var(--text)',
          soft: 'var(--text-soft)',
          mute: 'var(--text-mute)',
        },
        line: {
          1: 'var(--line-1)',
          2: 'var(--line-2)',
          3: 'var(--line-3)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        alert: 'var(--alert)',
        danger: 'var(--danger)',
        purple: 'var(--purple)',
        pink: 'var(--pink)',

        // Aliases shadcn compat (hsl wrap)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent-hsl))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '14px',
        '3xl': '18px',
        pill: '999px',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        4: 'var(--shadow-4)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'alive-breathe': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.85)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        breathe: 'alive-breathe 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
