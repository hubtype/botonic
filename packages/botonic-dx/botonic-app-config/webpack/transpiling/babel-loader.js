const babelLoaderConfig = {
  test: /\.(js|ts)x?$/,
  exclude: /node_modules[\/\\](?!(@botonic)[\/\\])/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/react'
      ],
      plugins: [
        require('babel-plugin-add-module-exports'),
        require('@babel/plugin-transform-runtime'),
      ],
    },
  },
}

module.exports = babelLoaderConfig;
