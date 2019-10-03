/*
 * This babel configuration is used along with Jest for execute tests,
 * do not modify to avoid conflicts with webpack.config.js.
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    [
      '@babel/react',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [
    require('@babel/plugin-proposal-object-rest-spread'),
    require('@babel/plugin-proposal-class-properties'),
    require('babel-plugin-add-module-exports'),
    require('@babel/plugin-transform-runtime')
  ]
}
