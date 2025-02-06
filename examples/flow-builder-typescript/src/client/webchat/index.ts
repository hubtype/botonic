import { WebchatApp, WebchatArgs } from '@botonic/react'

import { START_CONVERSATION_PAYLOAD } from '../../server/constants'

export const webchat: WebchatArgs = {
  onOpen: (app: WebchatApp) => {
    if (app.getMessages()?.length === 0) {
      app.addUserPayload(START_CONVERSATION_PAYLOAD)
    }
  },
}
