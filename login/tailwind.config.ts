import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // --- Surfaces navy TKWS ---
        bg: '#061828',
        canvas: '#061828',
        surface: {
          1: '#08263F',
          2: '#0A2F4D',
          3: '#0E3A5E',
          4: '#103E66',
        },
        paper: '#08263F',
        // --- Brand cyan ---
        brand: {
          DEFAULT: '#74C7E4',
          hover: '#7FD3F0',
          press: '#5BA5C2',
          soft: 'rgba(116,199,228,0.14)',
        },
        // --- Ink ---
        ink: {
          1: '#F5FAFC',
          2: '#E1ECF2',
          3: '#B6C5D4',
          4: '#7F94A8',
          5: '#4A5E72',
        },
        // --- Lines ---
        line: {
          1: 'rgba(157,200,222,0.10)',
          2: 'rgba(157,200,222,0.20)',
          3: 'rgba(157,200,222,0.32)',
        },
        // --- Semantic ---
        success: '#5FD9A5',
        warning: '#F2C94C',
        alert: '#F2994A',
        danger: '#EB5757',
        // --- shadcn compat (mapeados nos tokens TKWS) ---
        border: 'rgba(157,200,222,0.16)',
        input: 'rgba(157,200,222,0.16)',
        ring: '#74C7E4',
        background: '#061828',
        foreground: '#F5FAFC',
        primary: {
          DEFAULT: '#74C7E4',
          foreground: '#061828',
        },
        secondary: {
          DEFAULT: '#08263F',
          foreground: '#B6C5D4',
        },
        muted: {
          DEFAULT: '#0A2F4D',
          foreground: '#7F94A8',
        },
        destructive: {
          DEFAULT: '#EB5757',
          foreground: '#F5FAFC',
        },
        card: {
          DEFAULT: '#08263F',
          foreground: '#F5FAFC',
        },
        popover: {
          DEFAULT: '#08263F',
          foreground: '#F5FAFC',
        },
        accent: {
          DEFAULT: 'rgba(116,199,228,0.14)',
          foreground: '#74C7E4',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.28)',
        'card-lg': '0 12px 32px rgba(0,0,0,0.32)',
        'glow': '0 0 0 1px rgba(116,199,228,0.30), 0 0 16px rgba(116,199,228,0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'spin-slow': 'spin-slow 1s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
