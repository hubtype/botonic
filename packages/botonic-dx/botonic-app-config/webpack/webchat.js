const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const transpilingLoaderConfig = require('./transpiling/transpiling-loader')
const {
  fileLoaderConfig,
  stylesLoaderConfig,
  imageminPlugin,
} = require('./assets-loaders')
const optimizationConfig = require('./optimization')

module.exports = ({ projectPath, env, argv }) => {
  console.log(env, argv)
  const mode = argv.mode || 'development'
  const port = env.port || 9000
  const fullstack = env.fullstack || false
  const playgroundCode = env.playgroundCode
  const websocketUrl = mode === 'development' && 'ws://localhost:9011/'
  const restApiUrl = mode === 'development' && 'http://localhost:9010/'
  return {
    ...optimizationConfig(mode),
    mode,
    devtool: 'inline-source-map',
    target: 'web',
    entry: path.resolve(projectPath, 'index.js'),
    module: {
      rules: [
        transpilingLoaderConfig('esbuild'),
        fileLoaderConfig,
        stylesLoaderConfig,
      ],
    },
    output: {
      path: path.resolve(projectPath, 'dist'),
      filename: 'webchat.botonic.js',
      library: 'Botonic',
      libraryTarget: 'umd',
      libraryExport: 'app',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    stats: 'minimal',
    devServer: {
      port,
      static: [
        path.join(projectPath, 'dist'),
        path.join(projectPath, '..', 'bot', 'src', 'nlp', 'tasks'),
      ],
      liveReload: true,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(projectPath, 'index.html'),
        filename: 'index.html',
      }),
      imageminPlugin,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: null,
        WEBCHAT_PUSHER_KEY: null,
        BOTONIC_TARGET: 'webchat',
      }),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(mode == 'production'),
        FULLSTACK: JSON.stringify(fullstack),
        PLAYGROUND_CODE: JSON.stringify(playgroundCode),
        ...(websocketUrl
          ? { WEBSOCKET_URL: JSON.stringify(websocketUrl) }
          : {}),
        ...(restApiUrl ? { REST_API_URL: JSON.stringify(restApiUrl) } : {}),
      }),
    ],
  }
}
