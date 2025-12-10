import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5f3',
          100: '#f4e9e4',
          200: '#e8d2c8',
          300: '#d7b4a3',
          400: '#c38e78',
          500: '#b4715a',
          600: '#a65d4e',
          700: '#8b4c42',
          800: '#72403a',
          900: '#5d3732',
          950: '#321b18',
        },
        secondary: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#e9dfd0',
          300: '#dbc8af',
          400: '#c9aa88',
          500: '#bd936c',
          600: '#b08360',
          700: '#926a51',
          800: '#785747',
          900: '#62483b',
          950: '#33251f',
        },
        accent: {
          50: '#fdfbea',
          100: '#faf5c8',
          200: '#f7ea93',
          300: '#f3d956',
          400: '#f0c72b',
          500: '#dfae1a',
          600: '#c08514',
          700: '#995e14',
          800: '#7f4b18',
          900: '#6b3e1a',
          950: '#3e200b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
