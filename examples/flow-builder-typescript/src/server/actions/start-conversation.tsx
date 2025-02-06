import {
  FlowBuilderActionProps,
  FlowBuilderMultichannelAction,
} from '@botonic/plugin-flow-builder'
import { RequestContext } from '@botonic/react'

import { BotRequest } from '../types'

// Action intended to be used in first interaction, when there is inactivity or when the start over button is clicked
export class StartConversationAction extends FlowBuilderMultichannelAction {
  static contextType = RequestContext
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    return super.executeConversationStart(request)
  }
}
