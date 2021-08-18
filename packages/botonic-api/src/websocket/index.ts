import { WebSocketServer } from './aws-websocket-server'
import { localWebSocketServer } from './local-websocket-server'

export const websocketServerFactory = ({
  env,
  onConnect,
  onAuth,
  onDisconnect,
}) => {
  if (env === 'local') {
    return localWebSocketServer({ onConnect, onAuth, onDisconnect })
  } else if (env === 'aws') {
    return WebSocketServer({
      onConnect,
      onAuth,
      onDisconnect,
    })
  } else {
    throw Error(
      `Error while creating WebSocket Server: Env [${env}] not supported`
    )
  }
}
