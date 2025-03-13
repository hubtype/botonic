import { WebchatApp, WebchatArgs } from '@botonic/react'

import { START_CONVERSATION_PAYLOAD } from '../../server/constants'

export const webchat: WebchatArgs = {
  onInit: app => app.open(),

  onOpen: (app: WebchatApp) => {
    if (app.getMessages()?.length === 0) {
      app.addUserPayload(START_CONVERSATION_PAYLOAD)
    }
  },
}
