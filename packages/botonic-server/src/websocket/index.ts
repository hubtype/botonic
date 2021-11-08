import { Environments } from '../constants'
import { WebSocketServer } from './aws-websocket-server'
import { localWebSocketServer } from './local-websocket-server'

export const websocketServerFactory = ({
  env,
  onConnect,
  onAuth,
  onDisconnect,
  dataProvider,
}) => {
  if (env === Environments.LOCAL) {
    return localWebSocketServer({
      onConnect,
      onAuth,
      onDisconnect,
      dataProvider,
    })
  } else if (env === Environments.AWS) {
    return WebSocketServer({
      onConnect,
      onAuth,
      onDisconnect,
      dataProvider,
    })
  } else {
    throw Error(
      `Error while creating WebSocket Server: Env [${env}] not supported`
    )
  }
}
