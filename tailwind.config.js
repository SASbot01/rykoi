/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ryoiki': {
          black: '#000000',
          dark: '#0a0a0a',
          white: '#FFFFFF',
          red: '#FF0000',
          'red-dark': '#CC0000',
          'red-blood': '#8B0000',
          'red-glow': '#FF3333',
          gray: '#1a1a1a',
          'gray-light': '#2a2a2a',
        }
      },
      fontFamily: {
        'display': ['Sora', 'sans-serif'],
        'body': ['Outfit', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'fill-bar': 'fill-bar 1s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'wave-slow': 'wave 12s ease-in-out infinite',
        'wave-slower': 'wave 16s ease-in-out infinite',
        'ripple': 'ripple 4s ease-out infinite',
        'blob': 'blob-morph 8s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 0, 0, 0.8), 0 0 60px rgba(139, 0, 0, 0.4)',
          },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'fill-bar': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-percentage)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'wave': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateX(-50%) translateY(-20px) rotate(2deg)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'blob-morph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-ryoiki': 'linear-gradient(135deg, #8B0000 0%, #FF0000 50%, #CC0000 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(255, 0, 0, 0.3)',
        'glow-lg': '0 0 60px rgba(255, 0, 0, 0.4)',
        'glow-xl': '0 0 80px rgba(255, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(255, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
