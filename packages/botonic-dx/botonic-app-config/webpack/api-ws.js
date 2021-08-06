const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const transpilingLoaderConfig = require('./transpiling/transpiling-loader')
const { nullLoaderConfig, imageminPlugin } = require('./assets-loaders')
const optimizationConfig = require('./optimization')
const WebpackBar = require('webpackbar')

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
