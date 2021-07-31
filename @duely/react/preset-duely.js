const path = require('path');

// {projectPath}\node_modules\tailwindcss\lib
const tailwindcssCliPath = require.main.path;

const modulesPath = path.resolve(tailwindcssCliPath, '../../');
const requireLocal = (module) => {
  const localModule = path.resolve(modulesPath, module);
  try {
    return require(localModule);
  } catch (e) {
    if (module.startsWith('@duely/react/')) {
      module = './' + module.substring('@duely/react'.length);
    }

    return require(module);
  }
};

const colors = requireLocal('tailwindcss/colors');

module.exports = {
  darkMode: 'media',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',

      gray: colors.blueGray,
      red: colors.rose,
      orange: colors.orange,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: {
        50: '#EEF6FF',
        100: '#E9F0FF',
        200: '#C3DAFE',
        300: '#A3BFFA',
        400: '#7F9CF5',
        500: '#667EEA',
        600: '#5A67D8',
        700: '#4C51BF',
        800: '#434190',
        900: '#3C366B'
      },

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
        progress: 'progress 1800ms cubic-bezier(.02,.25,1,.61) infinite',
        'stroke-draw': 'stroke-draw 800ms ease-in 300ms',
      },
      colors: {
        gray: {
          25: '#FBFCFD',
          75: '#F5F8FB',
          550: '#56657A'
        }
      },
      keyframes: {
        progress: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(110%)' }
        },
        'stroke-draw': {
          from: { strokeDashoffset: '1', strokeDasharray: '1' },
          to: { strokeDashoffset: '0', strokeDasharray: '1' }
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '700'
            },
            'h1 strong': {
              fontWeight: '800'
            },
            'h1:first-child': {
              marginTop: '0',
            },
            'h1:last-child': {
              marginBottom: '0',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '700'
            },
            'h2 strong': {
              fontWeight: '800'
            },
            'h2:first-child': {
              marginTop: '0',
            },
            'h2:last-child': {
              marginBottom: '0',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600'
            },
            'h3 strong': {
              fontWeight: '700'
            },
            'h3:first-child': {
              marginTop: '0',
            },
            'h3:last-child': {
              marginBottom: '0',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600'
            },
            'h4 strong': {
              fontWeight: '700'
            },
            'h4:first-child': {
              marginTop: '0',
            },
            'h4:last-child': {
              marginBottom: '0',
            }
          }
        }
      })
    }
  },
  plugins: [requireLocal('@tailwindcss/typography'), requireLocal('@tailwindcss/aspect-ratio')]
};
