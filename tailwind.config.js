/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F7F3',
        card: '#FFFFFF',
        sidebar: '#F0F1EB',
        border: '#E6E8E1',
        primary: {
          DEFAULT: '#345B49', // Primary forest green
          dark: '#263F35',    // Deep forest
          light: '#45735D',
        },
        sage: {
          light: '#F4F7F4',
          DEFAULT: '#E8EFE8', // Pale sage
          dark: '#D5E2D5',
        },
        olive: {
          light: '#F0F4EC',
          DEFAULT: '#DDE5D6', // Soft olive
          dark: '#C8D4BF',
        },
        sand: {
          light: '#F9F6F0',
          DEFAULT: '#F0E9DC', // Warm sand
          dark: '#E2D7C3',
        },
        terracotta: {
          light: '#F5ECE8',
          DEFAULT: '#B87559', // Restrained terracotta
          dark: '#9E5F46',
        },
        text: {
          primary: '#202820',   // Primary dark text
          secondary: '#687168', // Secondary text
          muted: '#929990',     // Muted text
        },
        status: {
          successBg: '#E7F1E8',
          successText: '#275236',
          warningBg: '#F6EDDA',
          warningText: '#7D5A1E',
          errorBg: '#F6E7E3',
          errorText: '#8E382A',
          infoBg: '#E8EEF3',
          infoText: '#2A5576',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
        input: '10px',
        modal: '18px',
        hero: '24px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(32, 40, 32, 0.04)',
        card: '0 4px 20px -2px rgba(32, 40, 32, 0.05)',
        elevated: '0 12px 32px -4px rgba(32, 40, 32, 0.08)',
        subtle: '0 1px 3px rgba(32, 40, 32, 0.04)',
      }
    },
  },
  plugins: [],
}
