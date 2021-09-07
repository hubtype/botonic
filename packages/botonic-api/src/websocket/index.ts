import { Environments } from '..'
import { WebSocketServer } from './aws-websocket-server'
import { localWebSocketServer } from './local-websocket-server'

export const websocketServerFactory = ({
  env,
  onConnect,
  onAuth,
  onDisconnect,
}) => {
  if (env === Environments.LOCAL) {
    return localWebSocketServer({ onConnect, onAuth, onDisconnect })
  } else if (env === Environments.AWS) {
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
