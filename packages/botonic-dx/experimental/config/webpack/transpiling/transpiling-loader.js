module.exports = (transpilingLoader = 'babel') => {
  if (transpilingLoader === 'esbuild') return require('./esbuild-loader')
  return require('./babel-loader')
}
