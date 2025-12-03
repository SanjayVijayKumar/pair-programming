import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'editor-bg': '#1e1e1e',
        'editor-fg': '#d4d4d4',
        'editor-border': '#2d2d30',
      },
      height: {
        'screen-minus-header': 'calc(100vh - 64px)',
        'screen-minus-status': 'calc(100vh - 120px)',
      },
    },
  },
  plugins: [],
}
export default config
