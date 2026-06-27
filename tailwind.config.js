/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#fcf8fb',
        'surface-dim': '#dcd9dc',
        'surface-container': '#f0edef',
        'surface-container-high': '#eae7ea',
        'on-surface': '#1b1b1d',
        'on-surface-muted': '#524436',
        outline: '#857464',
        primary: '#895200',
        'primary-container': '#e89a3c',
        'on-primary': '#ffffff',
        secondary: '#4a6549',
        'secondary-container': '#ccebc7',
        tertiary: '#964735',
        'tertiary-container': '#f3907a',
        border: {
          subtle: 'rgba(27, 27, 29, 0.05)',
          DEFAULT: 'rgba(27, 27, 29, 0.08)',
          strong: 'rgba(27, 27, 29, 0.12)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.04em' }],
        caption: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      },
      letterSpacing: {
        label: '0.08em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,27,29,0.04), 0 4px 16px rgba(27,27,29,0.06)',
        'card-hover': '0 2px 4px rgba(27,27,29,0.05), 0 8px 24px rgba(27,27,29,0.08)',
        'card-lg': '0 2px 8px rgba(27,27,29,0.04), 0 12px 32px rgba(27,27,29,0.07)',
        nav: '0 -4px 24px rgba(27,27,29,0.06), 0 -1px 0 rgba(27,27,29,0.04)',
        glow: '0 0 0 4px rgba(232, 154, 60, 0.22)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
