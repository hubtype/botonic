/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const rspack = require('@rspack/core')
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh')
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
  API_URL: 'https://api.hubtype.com', // pragma: allowlist secret
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

const isDev = String(process.env.ENVIRONMENT) === 'local'

const typescriptLoaderConfig =
  // exclude: /node_modules[/\\](?!(@botonic\/(core|react))[/\\])/,
  [
    {
      test: /\.tsx?$/,
      exclude: [/node_modules/],
      use: {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            keepClassNames: true,
          },
        },
      },
      type: 'javascript/auto',
    },
    {
      test: /\.jsx?$/,
      exclude: [/node_modules/],
      use: {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
            transform: {
              react: {
                pragma: 'React.createElement',
                pragmaFrag: 'React.Fragment',
                throwIfNamespace: true,
                development: isDev,
                refresh: isDev,
                useBuiltins: false,
              },
            },
            keepClassNames: true,
          },
        },
      },
      type: 'javascript/auto',
    },
  ]

const fileLoaderConfig = [
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource',
  },
  {
    test: /^BUILD_ID$/,
    type: 'asset/source',
  },
]

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: 'null-loader',
}

const stylesLoaderConfig = [
  {
    test: /\.(sass|scss|css)$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    type: 'javascript/auto',
  },
]

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

  const plugins = [
    new rspack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      HUBTYPE_API_URL: process.env.HUBTYPE_API_URL || hubtypeDefaults.API_URL,
      BOTONIC_TARGET: 'node',
      WEBCHAT_PUSHER_KEY:
        process.env.WEBCHAT_PUSHER_KEY || hubtypeDefaults.WEBCHAT_PUSHER_KEY,
      ENVIRONMENT: process.env.ENVIRONMENT,
    }),
    new rspack.ProgressPlugin(),
  ]

  if (isDev) {
    plugins.push(new ReactRefreshPlugin())
  }

  return plugins
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

// Not work for Webviews, not keep fnames
const minimizerPlugin = new rspack.SwcJsMinimizerRspackPlugin({
  minimizerOptions: {
    minify: true,
    compress: {
      keep_classnames: true,
      keep_fargs: false,
      keep_fnames: true,
    },
    mangle: {
      keep_fnames: true,
      keep_classnames: true,
    },
  },
})

function botonicDevConfig(mode) {
  return {
    optimization: {
      minimize: false,
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.DEV),
    module: {
      rules: [
        ...typescriptLoaderConfig,
        ...fileLoaderConfig,
        ...stylesLoaderConfig,
      ],
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
      new rspack.NormalModuleReplacementPlugin(/node:stream/, resource => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
      ...getPlugins(mode, BOTONIC_TARGET.DEV),
    ],
  }
}

function botonicWebchatConfig(mode) {
  return {
    optimization: {
      minimize: true,
      minimizer: [minimizerPlugin],
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
      rules: [
        ...typescriptLoaderConfig,
        ...fileLoaderConfig,
        ...stylesLoaderConfig,
      ],
    },
    resolve: resolveConfig,
    plugins: [
      getHtmlWebpackPlugin(TEMPLATES.WEBCHAT),
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
      minimizer: mode === MODE_PROD ? [minimizerPlugin] : [],
    },
    mode,
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
      rules: [
        ...typescriptLoaderConfig,
        ...fileLoaderConfig,
        ...stylesLoaderConfig,
      ],
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
      minimize: true,
      minimizer: mode === MODE_PROD ? [minimizerPlugin] : [],
    },
    context: ROOT_PATH,
    // 'mode' removed so that we're forced to be explicit
    target: 'node',
    entry: path.resolve(WEBPACK_ENTRIES_DIRNAME, WEBPACK_ENTRIES.NODE),
    output: {
      filename: BOT_FILENAME,
      library: BOT_LIBRARY_NAME,
      libraryTarget: 'umd',
      libraryExport: 'app',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
      rules: [...typescriptLoaderConfig, ...fileLoaderConfig, nullLoaderConfig],
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
