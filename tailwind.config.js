/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d99178',
          foreground: '#0a0a0a',
        },
        background: '#0a0a0a',
        foreground: '#ededed',
        muted: {
          DEFAULT: '#262626',
          foreground: '#a3a3a3',
        },
        border: 'rgba(96, 96, 104, 0.2)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
