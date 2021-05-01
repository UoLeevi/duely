module.exports = {
  mode: 'jit',
  presets: [require('./preset-duely')],
  purge: {
    content: [
      './public/*.html',
      './src/**/*.js',
      './src/**/*.ts',
      './src/**/*.tsx'
    ],
    options: {
      safelist: [/^grecaptcha-/]
    }
  }
};
