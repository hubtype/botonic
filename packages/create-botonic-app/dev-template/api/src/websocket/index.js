import { websocketServerFactory } from '@botonic/api/src/websocket'
import { dataProviderFactory } from '@botonic/core/lib/esm/data-provider'

import { onAuth } from './onauth'
import { onConnect } from './onconnect'
import { onDisconnect } from './ondisconnect'

const dataProvider = dataProviderFactory(process.env.DATA_PROVIDER_URL)

export default websocketServerFactory({
  // eslint-disable-next-line no-undef
  env: ENV,
  onConnect,
  onAuth,
  onDisconnect,
  dataProvider,
})
