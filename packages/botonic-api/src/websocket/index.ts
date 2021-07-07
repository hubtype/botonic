import { WebSocketServer } from './aws-websocket-server'
import { localWebSocketServer } from './local-websocket-server'

export const websocketServerFactory = ({
  env,
  onConnect,
  onMessage,
  onDisconnect,
}) => {
  if (env === 'local') {
    return localWebSocketServer({ onConnect, onMessage, onDisconnect })
  } else if (env === 'aws') {
    return WebSocketServer({
      onConnect,
      onMessage,
      onDisconnect,
    })
  } else {
    throw Error(
      `Error while creating WebSocket Server: Env [${env}] not supported`
    )
  }
}
