/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': '#020617',
        'concrete': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'electric': {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        'cyan': {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        'blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        'indigo': {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        'teal': {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        'green': {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'technical': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
