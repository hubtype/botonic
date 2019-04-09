const path = require("path");
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const root = path.resolve(__dirname, "src");

const terserPlugin = new TerserPlugin({
  terserOptions: {
    keep_fnames: true
  }
});

const babelLoaderConfig = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules\/(?!(@botonic)\/)/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: ["@babel/preset-env", "@babel/react", "@babel/typescript"],
      plugins: [
        require("@babel/plugin-proposal-object-rest-spread"),
        require("@babel/plugin-proposal-class-properties"),
        require("babel-plugin-add-module-exports"),
        require("@babel/plugin-transform-runtime"),
        require("babel-plugin-react-css-modules")
      ]
    }
  }
};

const typescriptLoaderConfig = {
  test: /\.(ts|tsx)$/,
  exclude: /node_modules\/(?!(@botonic)\/)/,
  use: {
    loader: "ts-loader",
    options: {
      // cacheDirectory: true,
      // presets: ['@babel/preset-env', '@babel/react'],
      // plugins: [
      //   require('@babel/plugin-proposal-object-rest-spread'),
      //   require('@babel/plugin-proposal-class-properties'),
      //   require('babel-plugin-add-module-exports'),
      //   require('@babel/plugin-transform-runtime')
      // ]
    }
  }
};

const fileLoaderConfig = {
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: "file-loader",
      options: {
        outputPath: "assets"
      }
    }
  ]
};

const nullLoaderConfig = {
  test: /\.(scss|css)$/,
  use: "null-loader"
};

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: ["style-loader", "css-loader", "sass-loader"]
};

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
});

// const botonicWebchatConfig = {
//   optimization: {
//     minimizer: [terserPlugin]
//   },
//   mode: 'development',
//   devtool: 'inline-source-map',
//   target: 'web',
//   entry: {
//     webviews: './src/app.ts'
//   },
//   module: {
//     rules: [babelLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'webchat.botonic.js',
//     library: 'Botonic',
//     libraryTarget: 'umd',
//     libraryExport: 'default',
//     publicPath: './'
//   },
//   resolve: {
//     extensions: ['*', '.js', '.jsx']
//   },
//   devServer: {
//     contentBase: path.join(__dirname, 'dist'),
//     watchContentBase: true,
//     historyApiFallback: true,
//     publicPath: '/',
//     hot: true
//   },
//   plugins: [
//     new CleanWebpackPlugin(),
//     new HtmlWebpackPlugin({
//       template: './node_modules/@botonic/react/src/webchat.template.html',
//       filename: 'index.html'
//     }),
//     new webpack.HotModuleReplacementPlugin(),
//     imageminPlugin
//   ]
// }

// const botonicWebviewsConfig = {
//   optimization: {
//     minimizer: [terserPlugin]
//   },
//   mode: 'development',
//   devtool: 'inline-source-map',
//   target: 'web',
//   entry: {
//     webviews: './src/webviews/index.js'
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist/webviews'),
//     filename: 'webviews.js',
//     library: 'BotonicWebview',
//     libraryTarget: 'umd',
//     libraryExport: 'default'
//   },
//   module: {
//     rules: [
//       babelLoaderConfig,
//       {
//         test: /\.(png|svg|jpg|gif)$/,
//         use: [
//           {
//             loader: 'file-loader',
//             options: {
//               outputPath: '../assets'
//             }
//           }
//         ]
//       },
//       stylesLoaderConfig
//     ]
//   },
//   resolve: {
//     extensions: ['*', '.js', '.jsx']
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './node_modules/@botonic/react/src/webview.template.html',
//       filename: 'index.html'
//     }),
//     imageminPlugin
//   ]
// }

const botonicServerConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  context: root,
  mode: "development",
  target: "node",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "botonic-plugin-contentful",
    libraryTarget: "umd",
    libraryExport: "default"
  },
  module: {
    rules: [typescriptLoaderConfig, fileLoaderConfig, nullLoaderConfig]
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [new CleanWebpackPlugin(), imageminPlugin]
};

module.exports = function(env) {
  // if (env.node) {
  return botonicServerConfig; // , botonicWebviewsConfig]
  // }
  // if (env.webchat) {
  //   return [botonicWebchatConfig]
  // }
};
