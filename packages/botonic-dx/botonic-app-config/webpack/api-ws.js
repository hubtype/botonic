const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const transpilingLoaderConfig = require('./transpiling/transpiling-loader')
const { nullLoaderConfig, imageminPlugin } = require('./assets-loaders')
const optimizationConfig = require('./optimization')
const WebpackBar = require('webpackbar')

const bundleExternals = mode => {
  // duplicated import of express in local development (api-rest and api-ws), telling webpack not to bundle it again
  if (mode === 'development') {
    return { externals: ['express'] }
  }
  return {}
}

module.exports = ({
  projectPath,
  mode = 'development',
  fullstack = true,
  env,
}) => ({
  ...optimizationConfig(mode),
  //context: root,
  mode: mode,
  target: 'node',
  entry: path.resolve(projectPath, 'src', 'websocket', 'index.js'),
  output: {
    path: path.resolve(projectPath, 'dist/websocket'),
    filename: 'server.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [transpilingLoaderConfig('esbuild'), nullLoaderConfig],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  ...bundleExternals(mode),
  stats: 'minimal',
  devtool: 'source-map',
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin({}),
    imageminPlugin,
    new webpack.DefinePlugin({
      ENV: JSON.stringify(env.provider || 'local'),
      ...(mode === 'development'
        ? { MODELS_BASE_URL: JSON.stringify('http://localhost:9000') }
        : {}),
    }),
    new NodemonPlugin({ env: { PORT: 9011 }, quiet: true }),
  ],
})
