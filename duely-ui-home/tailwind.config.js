module.exports = {
  presets: [
    require('@duely/react/preset-duely')
  ],
  purge: [
    './public/*.html',
    './src/**/*.js',
    './node_modules/\\@duely/react/dist/**/*.js'
  ]
}
