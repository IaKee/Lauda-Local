/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lauda: {
          canvas: 'var(--lauda-canvas)',
          paper: 'var(--lauda-paper)',
          surface: 'var(--lauda-surface)',
          sidebar: 'var(--lauda-sidebar)',
          navActive: 'var(--lauda-nav-active)',
          field: 'var(--lauda-field)',
          ink: 'var(--lauda-ink)',
          inkSoft: 'var(--lauda-ink-soft)',
          line: 'var(--lauda-line)',
          muted: 'var(--lauda-muted)',
          accent: 'var(--lauda-accent)',
          accentWarm: 'var(--lauda-accent-warm)',
          danger: 'var(--lauda-danger)',
          success: 'var(--lauda-success)',
          primary: 'var(--lauda-primary)',
          primaryActive: 'var(--lauda-primary-active)',
          primaryText: 'var(--lauda-primary-text)',
          button: 'var(--lauda-button)',
          buttonActive: 'var(--lauda-button-active)',
        }
      }
    },
  },
  plugins: [],
}
