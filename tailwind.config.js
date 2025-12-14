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
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "surface-dark": "#1C2630",
        "surface-light": "#FFFFFF",

        // Mapping for legacy/shared components if needed
        background: {
          DEFAULT: '#101922', // Match background-dark
          card: '#1C2630',    // Match surface-dark
          subtle: '#293038',  // Border color derived from template
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
