const TerserPlugin = require('terser-webpack-plugin')

module.exports = mode => {
  if (mode === 'development') return {}
  return {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
          },
        }),
      ],
    },
  }
}
