module.exports = {
  presets: [require('./preset-duely')],
  purge: [
    './src/**/*!(stories).js'
  ],
}
