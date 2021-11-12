import { Environments } from '../constants'
import { AWSWebsocketServer } from './aws-websocket-server'
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
    return AWSWebsocketServer({
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
