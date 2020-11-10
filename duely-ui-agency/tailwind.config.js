const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('router-link-active', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.active .${e(`router-link-active${separator}${className}`)}`
        })
      })
    })
  ],
  presets: [
    require('@duely/react/preset-duely')
  ],
  purge: [
    './public/*.html',
    './src/**/*.js',
    './node_modules/\\@duely/react/dist/**/*.js'
  ],
  variants: {
    display: ['responsive', 'router-link-active'],
  }
}
