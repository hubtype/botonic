const withCSS = require('@zeit/next-css')
const withTM = require('@weco/next-plugin-transpile-modules')
module.exports = withTM(withCSS({
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.node = {
      fs: 'empty',
      module: "empty",
    };
    return config;
  },
  transpileModules: []
}));