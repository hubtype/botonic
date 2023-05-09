const Dotenv = require('dotenv-webpack')

module.exports = function (context, options) {
  return {
    name: 'custom-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      // Overriding some Webpack config to allow @botonic/react and Tailwind transpilation
      // BEWARE, sometimes Docusaurus changes the order of these rules in different alpha versions

      // override images loader
      config.module.rules[0] = {
        use: ['file-loader'],
        test: /\.(ico|jpg|jpeg|png|gif|webp)(\?.*)?$/,
      }

      // jsx/tsx rule.
      config.module.rules[3].exclude = excludeDocusaurusAndBotonic

      // postcss plugins to include Tailwind
      try {
        config.module.rules[4].use[2].options.plugins = postCSSPlugins
      } catch (e) {
        //console.log('error ', e)
      }
      config.module.rules.push({
        test: /\.(scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      })
      config.plugins.push(
        new Dotenv({
          path: './.env', // The path to your environment variables.
          safe: false, // If false ignore safe-mode, if true load './.env.example', if a string load that file as the sample
          systemvars: false, // Set to true if you would rather load all system variables as well (useful for CI purposes)
          silent: false, //  If true, all warnings will be suppressed
          expand: false, // Allows your variables to be "expanded" for reusability within your .env file
          defaults: false, //  Adds support for dotenv-defaults. If set to true, uses ./.env.defaults
        })
      )
      return {}
    },
  }
}

function excludeDocusaurusAndBotonic(modulePath) {
  // always transpile client dir
  if (modulePath.startsWith(exports.clientDir)) {
    return false
  }
  // Don't transpile node_modules except any docusaurus or botonic npm package
  return (
    /node_modules/.test(modulePath) &&
    !/(docusaurus)((?!node_modules).)*\.jsx?$/.test(modulePath) &&
    !/(@botonic\/core\/src)((?!node_modules).)*\.jsx?$/.test(modulePath) &&
    !/(@botonic\/react\/src)((?!node_modules).)*\.jsx?$/.test(modulePath)
  )
}

function postCSSPlugins() {
  return [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
  ]
}
