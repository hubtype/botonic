/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, 'src')
const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const WEBVIEWS_PATH = path.resolve(OUTPUT_PATH, 'webviews')
const BOTONIC_PATH = path.resolve(
  __dirname,
  'node_modules',
  '@botonic',
  'react'
)

const BOTONIC_TARGET = Object.freeze({
  ALL: 'all',
  DEV: 'dev',
  NODE: 'node',
  WEBVIEWS: 'webviews',
  WEBCHAT: 'webchat',
})

const WEBPACK_ENTRIES_DIRNAME = 'webpack-entries'
const WEBPACK_ENTRIES = {
  DEV: 'dev-entry.ts',
  NODE: 'node-entry.ts',
  WEBCHAT: 'webchat-entry.ts',
  WEBVIEWS: 'webviews-entry.ts',
}

const TEMPLATES = {
  WEBCHAT: 'webchat.template.html',
  WEBVIEWS: 'webview.template.html',
}

const UMD_LIBRARY_TARGET = 'umd'

const BOTONIC_LIBRARY_NAME = 'Botonic'
const WEBVIEW_LIBRARY_NAME = 'BotonicWebview'
const BOT_LIBRARY_NAME = 'bot'

const WEBCHAT_FILENAME = 'webchat.botonic.js'
const WEBVIEWS_FILENAME = 'webviews.js'
const BOT_FILENAME = 'bot.js'

const MODE_DEV = 'development'
const MODE_PROD = 'production'
const hubtypeDefaults = {
  API_URL: 'https://api.hubtype.com',
  WEBCHAT_PUSHER_KEY: '434ca667c8e6cb3f641c', // pragma: allowlist secret
}

const CONFIG_ENVIRONMENTS = ['production', 'staging', 'local']

const resolveConfig = {
  extensions: ['.*', '.js', '.jsx', '.ts', '.tsx'],
  alias: {
    BotonicProject: path.resolve(__dirname, 'src'),
    react: path.resolve('./node_modules/react'),
    // 'styled-components': path.resolve('./node_modules/styled-components'),
    '@botonic/react': BOTONIC_PATH,
  },
}

const terserPlugin = new TerserPlugin({
  terserOptions: {
    keep_fnames: true,
    sourceMap: true,
  },
})

const typescriptLoaderConfig = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules[/\\](?!(@botonic\/(core|react))[/\\])/,
  use: {
    loader: 'babel-loader',
    options: {
      sourceType: 'unambiguous',
      cacheDirectory: true,
      presets: [
        '@babel/react',
        [
          '@babel/env',
          {
            modules: false, // Needed for tree shaking to work.
          },
        ],
        '@babel/typescript',
      ],
      plugins: [
        require('babel-plugin-add-module-exports'),
        // require('@babel/plugin-transform-runtime'),
      ],
    },
  },
}

const fileLoaderConfig = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    type: 'asset/resource',
  },
  // {
  //   test: /\.svg/,
  //   type: 'asset/inline',
  // },
]

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: 'null-loader',
}

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
}

const imageMinimizerPlugin = new ImageMinimizerPlugin({
  minimizer: {
    implementation: ImageMinimizerPlugin.imageminMinify,
    options: {
      // Lossless optimization with custom option
      // Feel free to experiment with options for better result for you
      plugins: [
        ['gifsicle', { interlaced: true }],
        ['jpegtran', { progressive: true }],
        ['optipng', { optimizationLevel: 5 }],
        // Svgo configuration here https://github.com/svg/svgo#configuration
        [
          'svgo',
          {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        ],
      ],
    },
  },
})

function log(message) {
  // using errors to avoid screwing up webpack-bundle-analyzer when running with --profile
  console.error(message)
}

function getHtmlWebpackPlugin(templateName) {
  return new HtmlWebpackPlugin({
    template: path.resolve(BOTONIC_PATH, 'src', templateName),
    filename: 'index.html',
  })
}

function getConfigEnvironment() {
  const configEnvironment = String(process.env.ENVIRONMENT).toLowerCase()
  if (!CONFIG_ENVIRONMENTS.includes(configEnvironment)) {
    console.error(
      `You need to set env var ENVIRONMENT to one of these: ${CONFIG_ENVIRONMENTS}. Current value: ${configEnvironment}`
    )
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
  return configEnvironment
}

function getPlugins(mode, target) {
  const environment = getConfigEnvironment()
  log(
    `Generating bundle for: ${target}\nWebpack running on mode '${mode}' with env var ENVIRONMENT set to: ${environment}`
  )
  return [
    imageMinimizerPlugin,
    new webpack.EnvironmentPlugin({
      HUBTYPE_API_URL: process.env.HUBTYPE_API_URL || hubtypeDefaults.API_URL,
      BOTONIC_TARGET: target,
      WEBCHAT_PUSHER_KEY:
        process.env.WEBCHAT_PUSHER_KEY || hubtypeDefaults.WEBCHAT_PUSHER_KEY,
      BOTONIC_PROJECT_ROOT: JSON.stringify(path.resolve(__dirname, 'src')),
      ENVIRONMENT: environment,
    }),
  ]
}

function sourceMap(mode) {
  if (mode === MODE_PROD) {
    return 'hidden-source-map'
  } else if (mode === MODE_DEV) {
    return 'eval-cheap-source-map'
  } else {
    throw new Error(
      'Invalid mode argument (' + mode + '). See package.json scripts'
    )
  }
}

function botonicDevConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin],
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.DEV),

    module: {
      rules: [typescriptLoaderConfig, ...fileLoaderConfig, stylesLoaderConfig],
    },
    output: {
      path: OUTPUT_PATH,
      filename: WEBCHAT_FILENAME,
      library: BOTONIC_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    resolve: resolveConfig,
    devServer: {
      static: [OUTPUT_PATH],
      liveReload: true,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      getHtmlWebpackPlugin(TEMPLATES.WEBCHAT),
      new NodePolyfillPlugin({ includeAliases: ['stream'] }),
      new webpack.NormalModuleReplacementPlugin(/node:stream/, resource => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
      ...getPlugins(mode, BOTONIC_TARGET.DEV),
    ],
  }
}

function botonicWebchatConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin],
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.WEBCHAT),
    output: {
      path: OUTPUT_PATH,
      filename: WEBCHAT_FILENAME,
      library: BOTONIC_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
      rules: [typescriptLoaderConfig, ...fileLoaderConfig, stylesLoaderConfig],
    },
    resolve: resolveConfig,
    devServer: {
      static: [OUTPUT_PATH],
      liveReload: true,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      getHtmlWebpackPlugin(TEMPLATES.WEBCHAT),
      new webpack.HotModuleReplacementPlugin(),
      ...getPlugins(mode, BOTONIC_TARGET.WEBCHAT),
    ],
  }
}

function botonicWebviewsConfig(mode) {
  return {
    optimization: {
      sideEffects: true, // critical so that tree-shaking discards browser code from @botonic/react
      usedExports: true,
      minimize: true,
      minimizer: mode === MODE_PROD ? [terserPlugin] : [],
    },
    mode: mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.WEBVIEWS),
    output: {
      path: WEBVIEWS_PATH,
      filename: WEBVIEWS_FILENAME,
      library: WEBVIEW_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      assetModuleFilename: '../assets/[hash][ext][query]',
    },
    module: {
      rules: [typescriptLoaderConfig, ...fileLoaderConfig, stylesLoaderConfig],
    },
    resolve: resolveConfig,
    plugins: [
      getHtmlWebpackPlugin(TEMPLATES.WEBVIEWS),
      ...getPlugins(mode, BOTONIC_TARGET.WEBVIEWS),
    ],
  }
}

function botonicServerConfig(mode) {
  return {
    optimization: {
      sideEffects: true, // critical so that tree-shaking discards browser code from @botonic/react
      minimizer: mode === MODE_PROD ? [terserPlugin] : [],
    },
    context: ROOT_PATH,
    // 'mode' removed so that we're forced to be explicit
    target: 'node',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.NODE),
    output: {
      filename: BOT_FILENAME,
      library: BOT_LIBRARY_NAME,
      libraryTarget: UMD_LIBRARY_TARGET,
      libraryExport: 'app',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
      rules: [typescriptLoaderConfig, ...fileLoaderConfig, nullLoaderConfig],
    },
    resolve: resolveConfig,
    plugins: getPlugins(mode, BOTONIC_TARGET.NODE),
  }
}

module.exports = function (env, argv) {
  if (env.target === BOTONIC_TARGET.ALL) {
    return [
      botonicServerConfig(argv.mode),
      botonicWebviewsConfig(argv.mode),
      botonicWebchatConfig(argv.mode),
    ]
  } else if (env.target === BOTONIC_TARGET.DEV) {
    return [botonicDevConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGET.NODE) {
    return [botonicServerConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGET.WEBVIEWS) {
    return [botonicWebviewsConfig(argv.mode)]
  } else if (env.target === BOTONIC_TARGET.WEBCHAT) {
    return [botonicWebchatConfig(argv.mode)]
  }
  throw new Error(`Invalid target ${env.target}`)
}
