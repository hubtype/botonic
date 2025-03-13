import { INPUT, Route } from '@botonic/core'
import { FlowBuilderMultichannelAction } from '@botonic/plugin-flow-builder'
import { QueuePositionChangedAction, StatusChangedAction } from '@botonic/react'

import { StartConversationAction } from './actions/start-conversation'
import { START_CONVERSATION_PAYLOAD } from './constants'
import { BotRequest } from './types'

export function routes(request: BotRequest): Route[] {
  console.log('input', request.input)
  const routes: Route[] = [
    {
      path: 'start-conversation',
      payload: START_CONVERSATION_PAYLOAD,
      action: StartConversationAction,
    },
    {
      path: 'case-status-changed',
      type: INPUT.EVENT_STATUS_CHANGED,
      action: StatusChangedAction,
    },
    {
      path: 'queue-position-changed',
      type: INPUT.EVENT_QUEUE_POSITION_CHANGED,
      action: QueuePositionChangedAction,
    },
    {
      path: 'flow-builder-action',
      text: /.*/,
      payload: /.*/,
      type: /.*/,
      action: FlowBuilderMultichannelAction,
    },
  ]

  return routes
}
