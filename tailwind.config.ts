import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core
        bg: 'var(--color-black-1)',
        surface: 'var(--color-black-2)',
        border: 'var(--color-white-10)',
        text: 'var(--color-white-90)',
        muted: 'var(--color-gray-8)',

        // Brand
        primary: 'var(--color-primary)',
        'primary-soft': 'var(--color-primary-30)',

        // Semantic
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',

        // Base
        white: 'var(--color-white)',
        black: 'var(--color-black)',
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-white) 100%)',
        'hero-radial':
          'radial-gradient(60% 60% at 50% 10%, var(--color-primary-30) 0%, rgba(19,19,19,0.2) 50%, transparent 80%)',
      },
      boxShadow: {
        glow: '0 0 32px var(--color-primary-30)',
        'glow-strong': '0 0 48px var(--color-primary-30), 0 0 24px var(--color-primary-30)',
        soft: '0 10px 30px rgba(0,0,0,0.35)',
      },
      borderColor: {
        DEFAULT: 'var(--color-white-10)',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '28px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
