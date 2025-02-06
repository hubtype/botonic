import { Configuration } from '@rspack/cli'
import * as rspack from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import path from 'path'

const ROOT_PATH = path.resolve(__dirname, 'src')
const OUTPUT_PATH = path.resolve(__dirname, 'dist')
const NODE_MODULES_PATH = path.resolve(__dirname, 'node_modules')
const WEBVIEWS_PATH = path.resolve(OUTPUT_PATH, 'webviews')
const BOTONIC_PATH = path.resolve(NODE_MODULES_PATH, '@botonic', 'react')

enum BotonicTarget {
  ALL = 'all',
  DEV = 'dev',
  NODE = 'node',
  WEBVIEWS = 'webviews',
  WEBCHAT = 'webchat',
}

const RSPACK_ENTRIES_DIRNAME = 'rspack-entries'
const RSPACK_ENTRIES = {
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

const LIBRARY_NAME = {
  BOTONIC: 'Botonic',
  WEBVIEW: 'BotonicWebview',
  BOT: 'bot',
}

const FILENAME = {
  WEBCHAT: 'webchat.botonic.js',
  WEBVIEWS: 'webviews.js',
  BOT: 'bot.js',
}

enum Mode {
  development = 'development',
  production = 'production',
}

const HUBTYPE_DEFAULTS = {
  API_URL: 'https://api.hubtype.com',
  WEBCHAT_PUSHER_KEY: '434ca667c8e6cb3f641c', // pragma: allowlist secret
}

const CONFIG_ENVIRONMENTS = ['production', 'staging', 'local']

const resolveConfig = {
  extensions: ['.*', '.js', '.jsx', '.ts', '.tsx'],
  alias: {
    BotonicProject: ROOT_PATH,
    react: path.resolve('./node_modules/react'),
    // 'styled-components': path.resolve('./node_modules/styled-components'),
    '@botonic/react': BOTONIC_PATH,
  },
}

const isDev = String(process.env.ENVIRONMENT) === 'local'

const typescriptLoaderConfig = [
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
          transform: {
            react: {
              runtime: 'automatic',
            },
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

function log(message: string) {
  // using errors to avoid screwing up rspack-bundle-analyzer when running with --profile
  console.error(message)
}

function getHtmlWebpackPlugin(templateName: string) {
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

function getPlugins(mode: string, target: string) {
  const environment = getConfigEnvironment()
  log(
    `Generating bundle for: ${target}\nRspack running on mode '${mode}' with env var ENVIRONMENT set to: ${environment}`
  )

  const plugins = [
    new rspack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      HUBTYPE_API_URL: process.env.HUBTYPE_API_URL || HUBTYPE_DEFAULTS.API_URL,
      BOTONIC_TARGET: BotonicTarget.NODE,
      WEBCHAT_PUSHER_KEY:
        process.env.WEBCHAT_PUSHER_KEY || HUBTYPE_DEFAULTS.WEBCHAT_PUSHER_KEY,
      ENVIRONMENT: process.env.ENVIRONMENT,
    }),
    new rspack.ProgressPlugin(),
  ]

  if (isDev) {
    // @ts-ignore
    plugins.push(new ReactRefreshPlugin())
  }

  return plugins
}

function sourceMap(mode: string) {
  if (mode === Mode.production) {
    return 'hidden-source-map'
  } else if (mode === Mode.development) {
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

function botonicDevConfig(mode: Mode): Configuration {
  return {
    optimization: {
      minimize: false,
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(RSPACK_ENTRIES_DIRNAME, RSPACK_ENTRIES.DEV),
    module: {
      rules: [
        ...typescriptLoaderConfig,
        ...fileLoaderConfig,
        ...stylesLoaderConfig,
      ],
    },
    output: {
      path: OUTPUT_PATH,
      filename: FILENAME.WEBCHAT,
      library: LIBRARY_NAME.BOTONIC,
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
      new NodePolyfillPlugin(),
      new rspack.NormalModuleReplacementPlugin(/node:stream/, resource => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
      ...getPlugins(mode, BotonicTarget.DEV),
    ],
  }
}

function botonicWebchatConfig(mode: Mode): Configuration {
  return {
    optimization: {
      minimize: true,
      minimizer: [minimizerPlugin],
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(RSPACK_ENTRIES_DIRNAME, RSPACK_ENTRIES.WEBCHAT),
    output: {
      path: OUTPUT_PATH,
      filename: FILENAME.WEBCHAT,
      library: LIBRARY_NAME.BOTONIC,
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
      ...getPlugins(mode, BotonicTarget.WEBCHAT),
    ],
  }
}

function botonicWebviewsConfig(mode: Mode): Configuration {
  return {
    optimization: {
      sideEffects: true, // critical so that tree-shaking discards browser code from @botonic/react
      usedExports: true,
      minimize: true,
      minimizer: mode === Mode.production ? [minimizerPlugin] : [],
    },
    mode,
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(RSPACK_ENTRIES_DIRNAME, RSPACK_ENTRIES.WEBVIEWS),
    output: {
      path: WEBVIEWS_PATH,
      filename: FILENAME.WEBVIEWS,
      library: LIBRARY_NAME.WEBVIEW,
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
      ...getPlugins(mode, BotonicTarget.WEBVIEWS),
    ],
  }
}

function botonicServerConfig(mode: string): Configuration {
  return {
    optimization: {
      sideEffects: true, // critical so that tree-shaking discards browser code from @botonic/react
      minimize: true,
      minimizer: mode === Mode.production ? [minimizerPlugin] : [],
    },
    context: ROOT_PATH,
    // 'mode' removed so that we're forced to be explicit
    target: 'node',
    entry: path.resolve(RSPACK_ENTRIES_DIRNAME, RSPACK_ENTRIES.NODE),
    output: {
      filename: FILENAME.BOT,
      library: LIBRARY_NAME.BOT,
      libraryTarget: 'umd',
      libraryExport: 'app',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
      rules: [...typescriptLoaderConfig, ...fileLoaderConfig, nullLoaderConfig],
    },
    resolve: resolveConfig,
    plugins: getPlugins(mode, BotonicTarget.NODE),
  }
}

export default function (
  env: { target: string },
  argv: { mode: Mode }
): Configuration[] {
  if (env.target === BotonicTarget.ALL) {
    return [
      botonicServerConfig(argv.mode),
      botonicWebviewsConfig(argv.mode),
      botonicWebchatConfig(argv.mode),
    ]
  } else if (env.target === BotonicTarget.DEV) {
    return [botonicDevConfig(argv.mode)]
  } else if (env.target === BotonicTarget.NODE) {
    return [botonicServerConfig(argv.mode)]
  } else if (env.target === BotonicTarget.WEBVIEWS) {
    return [botonicWebviewsConfig(argv.mode)]
  } else if (env.target === BotonicTarget.WEBCHAT) {
    return [botonicWebchatConfig(argv.mode)]
  }
  throw new Error(`Invalid target ${env.target}`)
}
