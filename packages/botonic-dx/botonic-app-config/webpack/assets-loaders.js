const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { extendDefaultPlugins } = require('svgo')

const fileLoaderConfig = {
  test: /\.(png|svg|jpg|gif|svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'assets',
      },
    },
  ],
}

const nullLoaderConfig = {
  test: /\.(scss|css|png|svg|jpg|jpeg|gif)$/,
  use: 'null-loader',
}

const stylesLoaderConfig = {
  test: /\.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
}

const imageminPlugin = new ImageMinimizerPlugin({
  minimizerOptions: {
    plugins: [
      ['gifsicle', { interlaced: true }],
      ['jpegtran', { progressive: true }],
      ['optipng', { optimizationLevel: 5 }],
      // Configuring svgo: https://github.com/webpack-contrib/image-minimizer-webpack-plugin/issues/190#issuecomment-801231993
      [
        'svgo',
        {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: {
                    active: false,
                  },
                },
              },
            },
          ],
        },
      ],
    ],
  },
})

module.exports = {
  fileLoaderConfig,
  stylesLoaderConfig,
  nullLoaderConfig,
  imageminPlugin,
}
