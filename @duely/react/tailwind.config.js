module.exports = {
  mode: 'jit',
  presets: [require('./preset-duely')],
  purge: {
    content: ['./src/**/*!(stories).js'],
    options: {
      safelist: [/^grecaptcha-/]
    }
  }
}
