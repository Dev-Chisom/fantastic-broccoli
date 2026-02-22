import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          tertiary: '#EC4899',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        background: '#05060A',
        surface: '#0C0F18',
        elevated: '#111827',
        primary: {
          DEFAULT: '#6366F1',
        },
        accent: '#22D3EE',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['30px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['24px', { lineHeight: '1.4' }],
        'h4': ['20px', { lineHeight: '1.5' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'DEFAULT': '0 4px 6px rgba(0,0,0,0.1)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
        'xl': '0 20px 25px rgba(0,0,0,0.1)',
        'soft': '0 18px 45px rgba(0,0,0,0.45)',
      },
      screens: {
        'mobile': '0px',
        'tablet': '641px',
        'desktop': '1025px',
        'lg-desktop': '1281px',
      },
    }
  },
  plugins: []
};

export default config;

