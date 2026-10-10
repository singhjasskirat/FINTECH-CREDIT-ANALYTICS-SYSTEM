/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0F172A', // Slate 900
        sidebarBg: '#1E1E2E',
        cardBg: '#1E293B', // Slate 800
        cardBorder: '#334155', // Slate 700
        riskGreen: '#10B981', // Green 500
        riskYellow: '#F59E0B', // Amber 500
        riskOrange: '#F97316', // Orange 500
        riskRed: '#EF4444', // Red 500
        metricBlue: '#3B82F6', // Blue 500
        metricPurple: '#8B5CF6', // Purple 500
        textPrimary: '#FFFFFF',
        textSecondary: '#94A3B8', // Slate 400
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'card-glow': '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }
    },
  },
  plugins: [],
}
