const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('router-link-active', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.active .${e(`router-link-active${separator}${className}`)}`;
        });
      });
    })
  ],
  presets: [require('@duely/react/preset-duely')],
  purge: [
    './safelist.txt',
    './public/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './node_modules/\\@duely/react/dist/**/*.js'
  ]
};
