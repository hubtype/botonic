exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig()
  config.module.rules = [
    // Omit the default rule where test === '\.jsx?$'
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),
    // Recreate it with custom exclude filter
    {
      // Called without any arguments, `loaders.js` will return an
      // object like:
      // {
      //   options: undefined,
      //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
      // }
      // Unless you're replacing Babel with a different transpiler, you probably
      // want this so that Gatsby will apply its required Babel
      // presets/plugins.  This will also merge in your configuration from
      // `babel.config.js`.
      ...loaders.js(),
      test: /\.jsx?$/,
      // Exclude all node_modules from transpilation, except for '@botonic'
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(@botonic)/.test(modulePath),
    },
    {
      test: /\.(scss)$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    },
  ]
  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config)
}
