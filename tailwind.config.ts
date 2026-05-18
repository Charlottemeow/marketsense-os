import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#0a0e17',
  			foreground: '#e2e8f0',
  			card: '#131A2B',
  			'card-hover': '#1a2338',
  			border: '#1E293B',
  			accent: {
  				DEFAULT: '#00D4FF',
  				foreground: '#0a0e17'
  			},
  			positive: '#22C55E',
  			negative: '#EF4444',
  			warning: '#FFB347',
  			muted: '#64748B',
  			sidebar: '#0d1117',
  			topbar: '#0f1623',
  		},
  		fontFamily: {
  			display: ['DM Serif Display', 'serif'],
  			mono: ['JetBrains Mono', 'monospace'],
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  		},
  		fontSize: {
  			'data-xs': ['11px', { lineHeight: '14px' }],
  			'data-sm': ['12px', { lineHeight: '16px' }],
  			'data-base': ['13px', { lineHeight: '18px' }],
  			'data-lg': ['15px', { lineHeight: '20px' }],
  			'data-xl': ['18px', { lineHeight: '24px' }],
  			'data-2xl': ['24px', { lineHeight: '32px' }],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'fade-in': {
  				from: { opacity: '0', transform: 'translateY(4px)' },
  				to: { opacity: '1', transform: 'translateY(0)' },
  			},
  			'pulse-soft': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.7' },
  			},
  		},
  		animation: {
  			'fade-in': 'fade-in 0.3s ease-out',
  			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
