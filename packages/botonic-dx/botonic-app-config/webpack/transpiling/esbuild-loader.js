const esbuildLoaderConfig = {
  test: /\.(js|ts)x?$/,
  exclude: /node_modules[\/\\](?!(@botonic)[\/\\])/,
  use: {
    loader: 'esbuild-loader',
    options: {
      loader: 'tsx',
    },
  },
}
module.exports = esbuildLoaderConfig
