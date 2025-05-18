/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E7A9',
          DEFAULT: '#D4AF37',
          dark: '#A68A28'
        },
        burgundy: {
          light: '#A40035',
          DEFAULT: '#800020',
          dark: '#560014'
        },
        cream: {
          light: '#FFFFF6',
          DEFAULT: '#FFFDD0',
          dark: '#F2E8B3'
        },
        charcoal: {
          light: '#3F3F3F',
          DEFAULT: '#2A2A2A',
          dark: '#1A1A1A'
        }
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['"Lato"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-in': 'slideIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};