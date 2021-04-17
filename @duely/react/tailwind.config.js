module.exports = {
  presets: [require('./preset-duely')],
  purge: {
    content: ['./src/**/*!(stories).js'],
    options: {
      safelist: [/^grecaptcha-/]
    }
  }
}
