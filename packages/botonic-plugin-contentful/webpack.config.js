const path = require("path");
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const root = path.resolve(__dirname, "src");

const terserPlugin = new TerserPlugin({
  terserOptions: {
    keep_fnames: true
  }
});

// const babelLoaderConfig = {
//   test: /\.(js|jsx|ts|tsx)$/,
//   exclude: /node_modules\/(?!(@botonic)\/)/,
//   use: {
//     loader: "babel-loader",
//     options: {
//       cacheDirectory: true,
//       presets: [
//         "@babel/preset-env",
//         "@babel/react",
//         "@babel/preset-typescript"
//       ],
//       plugins: [
//         require("@babel/plugin-proposal-object-rest-spread"),
//         require("@babel/plugin-proposal-class-properties"),
//         require("babel-plugin-add-module-exports"),
//         require("@babel/plugin-transform-runtime"),
//       ]
//     }
//   }
// };

const typescriptLoaderConfig = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules\/(?!(@botonic)\/)/,
  use: {
    loader: "ts-loader",
    options: {
      // see https://github.com/TypeStrong/ts-loader#loader-options
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

const botonicServerConfig = {
  optimization: {
    minimizer: [terserPlugin]
  },
  context: root,
  mode: "development",
  target: "node",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: "botonic-plugin-contentful",
    libraryTarget: "umd",
  },
  module: {
    rules: [typescriptLoaderConfig, fileLoaderConfig, stylesLoaderConfig]
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [new CleanWebpackPlugin(), imageminPlugin]
};

module.exports = function (env) {
  return botonicServerConfig;
};
