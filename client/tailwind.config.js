/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        brand: {
          obsidian: '#090E17',
          slate: '#0F172A',
          emerald: '#059669',
          mint: '#10B981',
          amber: '#F59E0B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          raised: '#FFFFFF',
          dark: '#0B111E',      // deep obsidian navy
          darkMuted: '#060A11', // darkest obsidian base
        },
        status: {
          active: '#059669', // emerald-600
          sold: '#DC2626',   // red-600
          offer: '#D97706',  // amber-600
        },
        dark: '#090E17',
        light: '#F8FAFC',
        card: {
          bg: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}