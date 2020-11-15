module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {
      animation: {
        progress: 'progress 1800ms cubic-bezier(.02,.25,1,.61) infinite'
      },
      keyframes: {
        progress: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(110%)' },
        }
      }
    },
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'focus-visible', 'focus-within'],
    outline: ['responsive', 'focus', 'focus-visible'],
    padding: ['responsive', 'first', 'last'],
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  experimental: {
    applyComplexClasses: true
  }
};
