const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const ROOT = path.resolve(__dirname, 'src')
const ASSETS_DIRNAME = 'assets'

const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const WEBVIEWS_PATH = path.resolve(OUTPUT_PATH, 'webviews')

const BOTONIC_PATH = path.resolve(
  __dirname,
  'node_modules',
  '@botonic',
  'react'
)

const WEBPACK_MODE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
}

const BOTONIC_TARGETS = {
  ALL: 'all',
  DEV: 'dev',
  NODE: 'node',
  WEBVIEWS: 'webviews',
  WEBCHAT: 'webchat',
}

const WEBPACK_ENTRIES_DIRNAME = 'webpack-entries'
const WEBPACK_ENTRIES = {
  DEV: 'dev-entry.js',
  NODE: 'node-entry.js',
  WEBCHAT: 'webchat-entry.js',
  WEBVIEWS: 'webviews-entry.js',
}

const TEMPLATES = {
  WEBCHAT: 'webchat.template.html',
  WEBVIEWS: 'webview.template.html',
}

const UMD_LIBRARY_TARGET = 'umd'
const BOTONIC_LIBRARY_NAME = 'Botonic'
const WEBCHAT_FILENAME = 'webchat.botonic.js'

function sourceMap(mode) {
  if (mode === WEBPACK_MODE.PRODUCTION) return 'hidden-source-map'
  else if (mode === WEBPACK_MODE.DEVELOPMENT) return 'eval-cheap-source-map'
  else
    throw new Error(
      'Invalid mode argument (' + mode + '). See package.json scripts'
    )
}

const optimizationConfig = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        keep_fnames: true,
      },
    }),
  ],
}

const resolveConfig = {
  extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.mjs'],
  alias: {
    react: path.resolve(__dirname, 'node_modules', 'react'),
    'styled-components': path.resolve(
      __dirname,
      'node_modules',
      'styled-components'
    ),
  },
  fallback: {
    util: require.resolve('util'),
  },
}

const babelLoaderConfig = {
  test: /\.(js|jsx|ts|tsx|mjs)$/,
  exclude: /node_modules\/(?!@botonic)/,
  use: {
    loader: 'babel-loader',
    options: {
      sourceType: 'unambiguous',
      cacheDirectory: true,
      presets: [
        '@babel/react',
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    },
  },
}

function fileLoaderConfig(outputPath) {
  return {
    test: /\.(jpe?g|png|gif|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath: outputPath,
        },
      },
    ],
  }
}

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: 'null-loader',
}

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        insert: function (element) {
          if (!window._botonicInsertStyles) window._botonicInsertStyles = []
          window._botonicInsertStyles.push(element)
        },
      },
    },
    'css-loader',
    'sass-loader',
  ],
}

const imageminPlugin = new ImageMinimizerPlugin({
  minimizer: {
    implementation: ImageMinimizerPlugin.imageminMinify,
    options: {
      plugins: [
        "imagemin-gifsicle",
        "imagemin-jpegtran",
        "imagemin-optipng",
        "imagemin-svgo",
      ],
    },
  },
})

function botonicDevConfig(mode) {
  return {
    mode: mode,
    devtool: sourceMap(mode),
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.DEV),
    target: 'web',
    module: {
      rules: [
        babelLoaderConfig,
        fileLoaderConfig(ASSETS_DIRNAME),
        stylesLoaderConfig,
      ],
    },
    output: {
      filename: WEBCHAT_FILENAME,
      library: BOTONIC_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      path: OUTPUT_PATH,
    },
    resolve: resolveConfig,
    devServer: {
      static: [OUTPUT_PATH],
      liveReload: true,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(BOTONIC_PATH, 'src', TEMPLATES.WEBCHAT),
        filename: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
      imageminPlugin,
      new webpack.DefinePlugin({
        IS_BROWSER: true,
        IS_NODE: false,
        HUBTYPE_API_URL: JSON.stringify(process.env.HUBTYPE_API_URL),
        ...(mode === 'development'
          ? { MODELS_BASE_URL: JSON.stringify('http://localhost:8080') }
          : {}),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  }
}

function botonicWebchatConfig(mode) {
  return {
    optimization: optimizationConfig,
    mode: mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.WEBCHAT),
    module: {
      rules: [
        babelLoaderConfig,
        fileLoaderConfig(ASSETS_DIRNAME),
        stylesLoaderConfig,
      ],
    },
    output: {
      filename: WEBCHAT_FILENAME,
      library: BOTONIC_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      path: OUTPUT_PATH,
    },
    resolve: resolveConfig,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(BOTONIC_PATH, 'src', TEMPLATES.WEBCHAT),
        filename: 'index.html',
      }),
      imageminPlugin,
      new webpack.DefinePlugin({
        IS_BROWSER: true,
        IS_NODE: false,
        HUBTYPE_API_URL: JSON.stringify(process.env.HUBTYPE_API_URL),
        WEBCHAT_PUSHER_KEY: JSON.stringify(process.env.WEBCHAT_PUSHER_KEY),
      }),
    ],
  }
}

function botonicWebviewsConfig(mode) {
  return {
    optimization: optimizationConfig,
    mode: mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.WEBVIEWS),
    output: {
      filename: 'webviews.js',
      library: 'BotonicWebview',
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      path: WEBVIEWS_PATH,
    },
    module: {
      rules: [
        babelLoaderConfig,
        fileLoaderConfig(path.join('..', ASSETS_DIRNAME)),
        stylesLoaderConfig,
      ],
    },
    resolve: resolveConfig,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(BOTONIC_PATH, 'src', TEMPLATES.WEBVIEWS),
        filename: 'index.html',
      }),
      imageminPlugin,
      new webpack.DefinePlugin({
        IS_BROWSER: true,
        IS_NODE: false,
        HUBTYPE_API_URL: JSON.stringify(process.env.HUBTYPE_API_URL),
      }),
    ],
  }
}

function botonicNodeConfig(mode) {
  return {
    context: ROOT,
    optimization: optimizationConfig,
    mode: mode,
    devtool: sourceMap(mode),
    target: 'node',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.NODE),
    resolve: resolveConfig,
    output: {
      filename: 'bot.js',
      library: 'bot',
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      path: OUTPUT_PATH,
    },
    module: {
      rules: [
        babelLoaderConfig,
        fileLoaderConfig(ASSETS_DIRNAME),
        nullLoaderConfig,
      ],
    },
    plugins: [
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
      imageminPlugin,
      new webpack.DefinePlugin({
        IS_BROWSER: false,
        IS_NODE: true,
        HUBTYPE_API_URL: JSON.stringify(process.env.HUBTYPE_API_URL),
      }),
    ],
  }
}

module.exports = function (env, argv) {
  if (env.target === BOTONIC_TARGETS.ALL) {
    return [
      botonicNodeConfig(argv.mode),
      botonicWebviewsConfig(argv.mode),
      botonicWebchatConfig(argv.mode),
    ]
  } else if (env.target === BOTONIC_TARGETS.DEV) {
    return [botonicDevConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGETS.NODE) {
    return [botonicNodeConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGETS.WEBVIEWS) {
    return [botonicWebviewsConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGETS.WEBCHAT) {
    return [botonicWebchatConfig(argv.mode)]
  } else {
    return null
  }
}
