module.exports = {
  presets: [
    require('@duely/react/preset-duely')
  ],
  purge: [
    './public/*.html',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
    './node_modules/\\@duely/react/dist/**/*.js'
  ]
}
