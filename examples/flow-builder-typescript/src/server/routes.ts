import { Route } from '@botonic/core'
import { FlowBuilderMultichannelAction } from '@botonic/plugin-flow-builder'

import { StartConversationAction } from './actions/start-conversation'
import { START_CONVERSATION_PAYLOAD } from './constants'

export function routes(): Route[] {
  const routes: Route[] = [
    {
      path: 'start-conversation',
      payload: START_CONVERSATION_PAYLOAD,
      action: StartConversationAction,
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
