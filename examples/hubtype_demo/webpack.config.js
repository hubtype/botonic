const path = require('path')
const ImageminPlugin = require('imagemin-webpack')
const imageminOptipng = require('imagemin-optipng')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const root = path.resolve(__dirname, 'src')
const botonicPath = path.resolve(__dirname, 'node_modules', '@botonic', 'react')

const resolveConfig = {
  extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  alias: {
    BotonicProject: path.resolve(__dirname, 'src')
  }
}

const terserPlugin = new TerserPlugin({
  terserOptions: {
    keep_fnames: true,
    sourceMap: true
  }
})

const typescriptLoaderConfig = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules[/\\](?!(@botonic\/(core|react))[/\\])/,
  use: {
    loader: 'babel-loader',
    options: {
      sourceType: 'unambiguous', //https://github.com/babel/babel/issues/8900
      cacheDirectory: true,
      presets: [
        '@babel/react',
        // babel/env before typescript to avoid losing constructor auto-assign https://github.com/babel/babel/issues/8752#issuecomment-486541662
        [
          '@babel/env',
          {
            modules: false // Needed for tree shaking to work.
          }
        ],
        '@babel/typescript'
      ],
      plugins: [
        require('@babel/plugin-proposal-object-rest-spread'),
        require('@babel/plugin-proposal-class-properties'),
        require('@babel/plugin-transform-runtime')
      ]
    }
  }
}

const fileLoaderConfig = {
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'assets'
      }
    }
  ]
}

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: 'null-loader'
}

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

const imageminPlugin = new ImageminPlugin({
  bail: false,
  cache: false,
  imageminOptions: {
    plugins: [
      imageminOptipng({
        optimizationLevel: 5
      })
    ]
  }
})

function sourceMap(mode) {
  console.log('Webpack running on mode:', mode)
  // changing it from inline-source-map to cheap-eval-source-map, build time improved from 48s to 40s
  if (mode === 'production') {
    // Typescript: "inline-source-map" does not map Typescript correctly but there's a patch I didn't test https://github.com/webpack/webpack/issues/7172#issuecomment-414115819
    // from https://webpack.js.org/configuration/devtool/ inline-source-map is slow and not good for production
    //return 'cheap-eval-source-map'; // fast builds, not for production, transformed code (lines only)

    // slow, good for production.A full SourceMap is emitted as a separate file. but doesn't add a reference comment to the bundle. Useful if you only want SourceMaps to map error stack traces from error reports, but don't want to expose your SourceMap for the browser development tools.
    return 'hidden-source-map'
  } else if (mode === 'development') {
    // 'eval-source-map' would be a good fit for staging (slow but generates original code)
    // from documentation: quick build time, very quick rebuild, transformed code (lines only)
    return 'cheap-eval-source-map' //callstacks show links to TS code
  } else {
    throw new Error(
      'Invalid mode argument (' + mode + '). See package.json scripts'
    )
  }
}

function botonicDevConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin]
    },
    mode: 'development',
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(botonicPath, 'src', 'entry.js'),

    module: {
      rules: [typescriptLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webchat.botonic.js',
      library: 'Botonic',
      libraryTarget: 'umd',
      libraryExport: 'app',
      publicPath: './'
    },
    resolve: resolveConfig,
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true,
      historyApiFallback: true,
      publicPath: '/',
      hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './node_modules/@botonic/react/src/webchat.template.html',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      imageminPlugin,
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: 'https://api.hubtype.com',
        BOTONIC_TARGET: 'dev',
        BOTONIC_PROJECT_ROOT: JSON.stringify(path.resolve(__dirname, 'src'))
      })
    ]
  }
}

function botonicWebchatConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin]
    },
    mode: 'development',
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(botonicPath, 'src', 'entry.js'),

    module: {
      rules: [typescriptLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webchat.botonic.js',
      library: 'Botonic',
      libraryTarget: 'umd',
      libraryExport: 'app',
      publicPath: './'
    },
    resolve: resolveConfig,
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true,
      historyApiFallback: true,
      publicPath: '/',
      hot: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './node_modules/@botonic/react/src/webchat.template.html',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      imageminPlugin,
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: 'https://api.hubtype.com',
        WEBCHAT_PUSHER_KEY: '',
        BOTONIC_TARGET: 'webchat'
      })
    ]
  }
}

function botonicWebviewsConfig(mode) {
  return {
    optimization: {
      minimizer: [terserPlugin]
    },
    mode: 'development',
    devtool: sourceMap(mode),
    target: 'web',
    entry: path.resolve(botonicPath, 'src', 'entry.js'),
    output: {
      path: path.resolve(__dirname, 'dist/webviews'),
      filename: 'webviews.js',
      library: 'BotonicWebview',
      libraryTarget: 'umd',
      libraryExport: 'app'
    },
    module: {
      rules: [
        typescriptLoaderConfig,
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: '../assets'
              }
            }
          ]
        },
        stylesLoaderConfig
      ]
    },
    resolve: resolveConfig,
    plugins: [
      new HtmlWebpackPlugin({
        template: './node_modules/@botonic/react/src/webview.template.html',
        filename: 'index.html'
      }),
      imageminPlugin,
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: 'https://api.hubtype.com',
        BOTONIC_TARGET: 'webviews'
      })
    ]
  }
}

function botonicServerConfig(mode) {
  return {
    optimization: {
      sideEffects: true, // critical so that tree-shaking discards browser code from @botonic/react
      minimizer: mode === 'production' ? [terserPlugin] : []
    },
    context: root,
    target: 'node',
    entry: path.resolve(botonicPath, 'src', 'entry.js'),
    output: {
      filename: 'bot.js',
      library: 'bot',
      libraryTarget: 'umd',
      libraryExport: 'app'
    },
    module: {
      rules: [typescriptLoaderConfig, fileLoaderConfig, nullLoaderConfig]
    },
    resolve: resolveConfig,
    plugins: [
      imageminPlugin,
      new webpack.EnvironmentPlugin({
        HUBTYPE_API_URL: 'https://api.hubtype.com',
        BOTONIC_TARGET: 'node'
      })
    ]
  }
}

module.exports = function(env, argv) {
  if (env.target === 'all') {
    return [
      botonicServerConfig(argv.mode),
      botonicWebviewsConfig(argv.mode),
      botonicWebchatConfig(argv.mode)
    ]
  } else if (env.target === 'dev') {
    let devConfig = botonicDevConfig(argv.mode)
    return [devConfig]
  } else if (env.target === 'node') {
    return [botonicServerConfig(argv.mode)]
  } else if (env.target === 'webviews') {
    return [botonicWebviewsConfig(argv.mode)]
  } else if (env.target === 'webchat') {
    return [botonicWebchatConfig(argv.mode)]
  }
}
