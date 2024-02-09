/*
 * This babel configuration is used along with Jest for execute tests,
 * do not modify to avoid conflicts with webpack.config.js.
 */
// require("@babel/register");

/*
 * This babel configuration is used along with Jest for execute tests,
 * do not modify to avoid conflicts with webpack.config.js.
 */

module.exports = {
  sourceType: 'unambiguous',
  // .map files are not generated unless babel invoked with --source-maps
  sourceMaps: true,
  presets: ['@babel/preset-env'],
  plugins: [
    require('babel-plugin-add-module-exports'),
    require('@babel/plugin-transform-runtime'),
  ],
}
