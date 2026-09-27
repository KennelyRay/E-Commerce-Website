/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sunken: token('sunken'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        ok: token('ok'),
        warn: token('warn'),
        danger: token('danger'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        control: '6px',
        card: '10px',
      },
      boxShadow: {
        overlay: '0 24px 48px -12px rgb(0 0 0 / 0.28), 0 0 0 1px rgb(var(--line))',
      },
      keyframes: {
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        draw: {
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-in': 'fade-in 200ms ease-out',
        'pop-in': 'pop-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        bump: 'bump 360ms ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
        draw: 'draw 450ms 250ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
