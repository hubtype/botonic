import { websocketServerFactory } from '@botonic/api/src/websocket'
import { onMessage } from './onmessage'
import { onConnect } from './onconnect'
import { onDisconnect } from './ondisconnect'

export default websocketServerFactory({
  env: ENV,
  onConnect,
  onMessage,
  onDisconnect,
})
