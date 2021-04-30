module.exports = {
  mode: 'jit',
  presets: [require('@duely/react/preset-duely')],
  purge: {
    content: [
      './public/*.html',
      './src/**/*.js',
      './src/**/*.ts',
      './src/**/*.tsx',
      './node_modules/\\@duely/react/dist/**/*.js'
    ],
    options: {
      safelist: [/^grecaptcha-/]
    }
  }
};
