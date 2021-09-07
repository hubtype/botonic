const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const transpilingLoaderConfig = require('@botonic/dx/botonic-app-config/webpack/transpiling/transpiling-loader')
const {
  nullLoaderConfig,
  imageminPlugin,
} = require('@botonic/dx/botonic-app-config/webpack/assets-loaders')
const optimizationConfig = require('@botonic/dx/botonic-app-config/webpack/optimization')
const WebpackBar = require('webpackbar')

module.exports = ({
  projectPath,
  mode = 'development',
  fullstack = true,
  env,
}) => {
  return {
    ...optimizationConfig(mode),
    //context: root,
    mode: mode,
    target: 'node',
    entry: {
      botExecutor: path.resolve(
        projectPath,
        'src',
        'handlers',
        'botExecutor.js'
      ),
      sender: path.resolve(projectPath, 'src', 'handlers', 'sender.js'),
    },
    output: {
      path: path.resolve(projectPath, 'dist/handlers'),
      filename: '[name].js',
      libraryTarget: 'umd',
    },
    module: {
      rules: [transpilingLoaderConfig('esbuild'), nullLoaderConfig],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    stats: 'minimal',
    //https://github.com/webpack/webpack/issues/1576#issuecomment-421596914
    ignoreWarnings: [/^(?!CriticalDependenciesWarning$)/],
    devtool: 'source-map',
    plugins: [
      new WebpackBar(),
      new CleanWebpackPlugin({}),
      imageminPlugin,
      new webpack.DefinePlugin({
        ENV: JSON.stringify('aws'),
      }),
    ],
  }
}
