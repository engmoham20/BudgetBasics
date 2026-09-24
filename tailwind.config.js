/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'border-custom': 'var(--border)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        'primary-fg': 'var(--primary-fg)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        tip: 'var(--tip)',
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};
