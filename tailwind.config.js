/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // Enable dark mode with class strategy
    theme: {
      extend: {
        colors: {
          // Light mode colors
          'light-bg': '#f6f8fa',
          'light-card': '#ffffff',
          'light-text': '#1f2937',
          'light-border': '#e5e7eb',
          
          // Dark mode colors
          'dark-bg': '#111827',
          'dark-card': '#1f2937',
          'dark-text': '#f9fafb',
          'dark-border': '#374151',
        },
      },
    },
    plugins: [],
  }