const webchatConfig = require('@botonic/dx/botonic-app-config/webpack/webchat')

module.exports = (env, argv) =>
  webchatConfig({
    projectPath: __dirname,
    env,
    argv,
    mode: argv.mode,
  })
