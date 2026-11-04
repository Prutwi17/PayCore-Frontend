/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paycore: {
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
          },
          navy: {
            800: '#1E293B',
            900: '#0F172A',
            950: '#020617',
          },
          surface: '#FFFFFF',
          muted: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
