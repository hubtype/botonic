const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const transpilingLoaderConfig = require('@botonic/dx/botonic-app-config/webpack/transpiling/transpiling-loader')
const {
  nullLoaderConfig,
  imageminPlugin,
} = require('@botonic/dx/botonic-app-config/webpack/assets-loaders')
const optimizationConfig = require('@botonic/dx/botonic-app-config/webpack/optimization')
const WebpackBar = require('webpackbar')

const getHandlerEntries = handlersPath => {
  const files = fs
    .readdirSync(handlersPath)
    .filter(file => !file.includes('index'))
  return files.reduce((entries, fileName) => {
    const entryName = fileName.split('.')[0]
    entries[entryName] = path.resolve(handlersPath, fileName)
    return entries
  }, {})
}

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
    entry: getHandlerEntries(path.resolve(projectPath, 'src', 'handlers')),
    output: {
      path: path.resolve(projectPath, 'dist', 'handlers'),
      filename: '[name]/index.js',
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
        ENV: JSON.stringify(env.provider || 'local'),
      }),
    ],
  }
}
