/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // EXACT PORT FROM HTML TEMPLATE
        "primary": "#d4af37", // Gold
        "background-light": "#f6f7f8",
        "background-dark": "#0f0f0f",
        "surface-dark": "#1a1a1a",
        "surface-light": "#FFFFFF",

        // Mapping for legacy/shared components if needed
        background: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          subtle: '#333333',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#9dabb9',
          muted: '#6a7785',
        },
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        // 'display': ['Manrope'] // We stick to Poppins as we likely don't have Manrope font files loaded
      },
    },
  },
  plugins: [],
};
