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
        "primary": "#d4af35", // Gold from UI Templates
        "background-light": "#f8f7f6",
        "background-dark": "#121212",
        "card-dark": "#1E1E1E",
        "text-muted": "#b6b1a0",

        // Legacy/Shared mappings
        background: {
          DEFAULT: '#121212', // Matches background-dark
          card: '#1E1E1E',   // Matches card-dark
          subtle: '#333333',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#b6b1a0', // Matches text-muted
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
