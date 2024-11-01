import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        textTitle: 'rgb(var(--color-text-title) / <alpha-value>)',
        textBody: 'rgb(var(--color-text-body) / <alpha-value>)',
        target: 'rgb(var(--color-target) / <alpha-value>)',
        targetInactive: 'rgb(var(--color-target-inactive) / <alpha-value>)',
        deleteColor: 'rgb(var(--color-delete) / <alpha-value>)'
      },
      screens: {
        sm: { max: '750px' }
      }
    }
  },
  plugins: []
}
export default config
