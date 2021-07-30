const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  theme: {
    screens: {
      sm: '600px'
    },
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
      }
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px',
      '8xl': '96px',
      '9xl': '128px'
    },
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      full: '9999px'
    },
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: ['ui-monospace', 'Menlo', 'Consolas', 'monospace']
    },
    spacing: {
      0: '0px',
      px: '1px',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      3.5: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px'
    },
    extend: {
      colors: {
        gray: {
          25: '#FBFCFD',
          75: '#F5F8FB'
        }
      }
    }
  },
  corePlugins: [
    'preflight',
    'container',
    'accessibility',
    'alignContent',
    'alignItems',
    'alignSelf',
    'animation',
    'appearance',
    'backdropBlur',
    'backdropBrightness',
    'backdropContrast',
    'backdropFilter',
    'backdropGrayscale',
    'backdropHueRotate',
    'backdropInvert',
    'backdropSaturate',
    'backdropSepia',
    'backgroundAttachment',
    'backgroundBlendMode',
    'backgroundClip',
    'backgroundColor',
    'backgroundImage',
    'backgroundOrigin',
    'backgroundPosition',
    'backgroundRepeat',
    'backgroundSize',
    'blur',
    'borderCollapse',
    'borderColor',
    'borderRadius',
    'borderStyle',
    'borderWidth',
    'boxDecorationBreak',
    'boxShadow',
    'boxSizing',
    'brightness',
    'caretColor',
    'clear',
    'content',
    'contrast',
    'cursor',
    'display',
    'divideColor',
    'divideStyle',
    'divideWidth',
    'dropShadow',
    'fill',
    'float',
    'fontFamily',
    'fontSize',
    'fontSmoothing',
    'fontStyle',
    'fontVariantNumeric',
    'fontWeight',
    'height',
    'inset',
    'isolation',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'letterSpacing',
    'lineHeight',
    'listStylePosition',
    'listStyleType',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'objectFit',
    'objectPosition',
    'opacity',
    'order',
    'outline',
    'overflow',
    'overscrollBehavior',
    'padding',
    'placeContent',
    'placeholderColor',
    'placeItems',
    'placeSelf',
    'position',
    'resize',
    'ringColor',
    'ringOffsetColor',
    'ringOffsetWidth',
    'ringWidth',
    'space',
    'tableLayout',
    'textAlign',
    'textColor',
    'textDecoration',
    'textOverflow',
    'textTransform',
    'userSelect',
    'verticalAlign',
    'visibility',
    'whitespace',
    'width',
    'wordBreak',
    'zIndex'
  ],
  purge: ['./src/templates/**/*!(-css).hbs']
};
