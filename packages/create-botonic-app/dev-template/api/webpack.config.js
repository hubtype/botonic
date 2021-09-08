const apiRestConfig = require('@botonic/dx/botonic-app-config/webpack/api-rest')
const apiWebsocketConfig = require('@botonic/dx/botonic-app-config/webpack/api-ws')
const handlersConfig = require('@botonic/dx/botonic-app-config/webpack/api-handlers')
module.exports = function (env, argv) {
  const config = {
    projectPath: __dirname,
    env,
    argv,
    mode: argv.mode,
  }
  if (env.target === 'rest') {
    return [apiRestConfig(config)]
  } else if (env.target === 'websocket') {
    return [apiWebsocketConfig(config)]
  } else if (env.target === 'handlers') {
    return [handlersConfig(config)]
  }

  return [apiRestConfig(config), apiWebsocketConfig(config)]
}
