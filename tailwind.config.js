/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-bg': '#f6f8fa',
        'light-card': '#ffffff',
        'light-text': '#1f2937',
        'light-border': '#e5e7eb',
        
        'dark-bg': '#111827',
        'dark-card': '#1f2937',
        'dark-text': '#f9fafb',
        'dark-border': '#374151',
        
        'gray-750': '#1e293b', // Additional dark gray for dark mode
      },
      fontWeight: {
        light: '300',
      },
    },
  },
  plugins: [],
}
