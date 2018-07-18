module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.node = {
      fs: 'empty',
      module: "empty",
    };
    return config;
  },
};
