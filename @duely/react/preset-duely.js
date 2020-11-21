const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',

      gray: colors.blueGray,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.amber,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,

      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      error: 'var(--color-error)',
      success: 'var(--color-success)'
    },
    extend: {
      animation: {
        progress: 'progress 1800ms cubic-bezier(.02,.25,1,.61) infinite'
      },
      colors: {
        gray: {
          25: '#fbfcfd'
        }
      },
      keyframes: {
        progress: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(110%)' }
        }
      }
    },
  },
  variants: {
    extend: {
      textColor: ['focus-visible'],
      borderColor: ['focus-visible'],
      boxShadow: ['focus-visible'],
      outline: ['focus-visible'],
      padding: ['first', 'last']
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
