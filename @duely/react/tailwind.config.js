const path = require('path');

// {projectPath}\node_modules\tailwindcss\lib
const tailwindcssCliPath = require.main.path;

const modulesPath = path.resolve(tailwindcssCliPath, '../../');
const requireLocal = module => require(path.resolve(modulesPath, module));

const plugin = requireLocal('tailwindcss/plugin');

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
  presets: [requireLocal('@duely/react/preset-duely')],
  purge: [
    './safelist.txt',
    './public/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './node_modules/\@duely/react/dist/**/*.js'
  ]
};
