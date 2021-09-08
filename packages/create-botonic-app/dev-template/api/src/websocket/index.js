import { websocketServerFactory } from '@botonic/api/src/websocket'
import { onAuth } from './onauth'
import { onConnect } from './onconnect'
import { onDisconnect } from './ondisconnect'

export default websocketServerFactory({
  env: ENV,
  onConnect,
  onAuth,
  onDisconnect,
})
