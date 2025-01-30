import { Route } from '@botonic/core'

import { ExtendedFlowBuilderAction } from './actions/extended-flow-builder'
import { StartConversationAction } from './actions/start-conversation'
import { START_CONVERSATION_PAYLOAD_REGEX } from './constants'
import { BotRequest } from './types'

export function routes(request: BotRequest): Route[] {
  console.log('[User Input]', request.input)

  const routes: Route[] = [
    {
      path: 'start-conversation',
      payload: START_CONVERSATION_PAYLOAD_REGEX,
      action: StartConversationAction,
    },
    {
      path: 'flow-builder-action',
      text: /.*/,
      payload: /.*/,
      type: /.*/,
      action: ExtendedFlowBuilderAction,
    },
  ]

  return routes
}
