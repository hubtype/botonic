const path = require('path')
const ImageminPlugin = require('imagemin-webpack')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminOptipng = require('imagemin-optipng')
const imageminSvgo = require('imagemin-svgo')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const root = path.resolve(__dirname, 'src')
const botonicPath = path.resolve(__dirname, 'node_modules', '@botonic', 'react')

const terserPlugin = new TerserPlugin({
  parallel: true,
  sourceMap: true,
  terserOptions: {
    keep_fnames: true
  }
})

const babelLoaderConfig = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules[\/\\](?!(@botonic)[\/\\])/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['@babel/preset-env', '@babel/react'],
      plugins: [
        require('@babel/plugin-proposal-object-rest-spread'),
        require('@babel/plugin-proposal-class-properties'),
        require('babel-plugin-add-module-exports'),
        require('@babel/plugin-transform-runtime'),
        require('@babel/plugin-syntax-dynamic-import')
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
      imageminGifsicle({
        interlaced: true
      }),
      imageminJpegtran({
        progressive: true
      }),
      imageminOptipng({
        optimizationLevel: 5
      }),
      imageminSvgo({
        removeViewBox: true
      })
    ]
  }
})

const botonicDevConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  entry: path.resolve(botonicPath, 'src', 'entry.js'),
  module: {
    rules: [babelLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webchat.botonic.js',
    library: 'Botonic',
    libraryTarget: 'umd',
    libraryExport: 'app',
    publicPath: './'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      BotonicProject: path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    contentBase: [
      path.join(__dirname, 'dist'),
      path.join(__dirname, 'src', 'nlu', 'models')
    ],
    watchContentBase: true,
    historyApiFallback: true,
    publicPath: '/',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(botonicPath, 'src', 'webchat.template.html'),
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    imageminPlugin,
    new webpack.EnvironmentPlugin({
      HUBTYPE_API_URL: null,
      BOTONIC_TARGET: 'dev'
    })
  ]
}

const botonicWebchatConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  mode: 'development',
  target: 'web',
  entry: path.resolve(botonicPath, 'src', 'entry.js'),
  module: {
    rules: [babelLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webchat.botonic.js',
    library: 'Botonic',
    libraryTarget: 'umd',
    libraryExport: 'app',
    publicPath: './'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      BotonicProject: path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(botonicPath, 'src', 'webchat.template.html'),
      filename: 'index.html'
    }),
    imageminPlugin,
    new webpack.EnvironmentPlugin({
      HUBTYPE_API_URL: null,
      WEBCHAT_PUSHER_KEY: null,
      BOTONIC_TARGET: 'webchat'
    })
  ]
}

const botonicWebviewsConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  mode: 'development',
  devtool: 'inline-source-map',
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
      babelLoaderConfig,
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
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      BotonicProject: path.resolve(__dirname, 'src')
    }
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(botonicPath, 'src', 'webview.template.html'),
      filename: 'index.html'
    }),
    imageminPlugin,
    new webpack.EnvironmentPlugin({
      HUBTYPE_API_URL: null,
      BOTONIC_TARGET: 'webviews'
    })
  ]
}

const botonicServerConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  context: root,
  mode: 'development',
  target: 'node',
  entry: path.resolve(botonicPath, 'src', 'entry.js'),
  output: {
    filename: 'bot.js',
    library: 'bot',
    libraryTarget: 'umd',
    libraryExport: 'app'
  },
  module: {
    rules: [babelLoaderConfig, fileLoaderConfig, nullLoaderConfig]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      BotonicProject: path.resolve(__dirname, 'src')
    }
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    imageminPlugin,
    new webpack.EnvironmentPlugin({
      HUBTYPE_API_URL: null,
      BOTONIC_TARGET: 'node'
    }),
    new CopyPlugin([{ from: 'nlu/models/', to: 'assets/models/' }])
  ]
}

module.exports = function(env) {
  if (env.target === 'all') {
    return [botonicServerConfig, botonicWebviewsConfig, botonicWebchatConfig]
  } else if (env.target === 'dev') {
    return [botonicDevConfig]
  } else if (env.target === 'node') {
    return [botonicServerConfig]
  } else if (env.target === 'webviews') {
    return [botonicWebviewsConfig]
  } else if (env.target === 'webchat') {
    return [botonicWebchatConfig]
  }
}
