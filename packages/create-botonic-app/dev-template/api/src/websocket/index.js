import { websocketServerFactory } from '@botonic/api/src/websocket'

import { onAuth } from './onauth'
import { onConnect } from './onconnect'
import { onDisconnect } from './ondisconnect'

export default websocketServerFactory({
  // eslint-disable-next-line no-undef
  env: ENV,
  onConnect,
  onAuth,
  onDisconnect,
})
