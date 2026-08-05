/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0D1117',
        sidebarBg: '#161B22',
        cardBg: '#1B2430',
        cardBorder: '#30363D',
        brandGreen: '#00C853',
        brandOrange: '#FB8C00',
        brandBlue: '#2979FF',
        brandPurple: '#8E24AA',
        brandRed: '#E53935',
        textPrimary: '#FFFFFF',
        textSecondary: '#B0BEC5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-green': '0 0 15px rgba(0, 200, 83, 0.3)',
        'neon-orange': '0 0 15px rgba(251, 140, 0, 0.3)',
        'neon-blue': '0 0 15px rgba(41, 121, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(142, 36, 170, 0.3)',
        'card-glow': '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(27, 36, 48, 0.8) 0%, rgba(22, 27, 34, 0.6) 100%)',
        'sidebar-gradient': 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)',
      }
    },
  },
  plugins: [],
}
