import { FlowBuilderActionProps } from '@botonic/plugin-flow-builder'
import { RequestContext } from '@botonic/react'

import { BotRequest } from '../../types'
import { getRequestData } from '../../utils/actions'
import { ExtendedFlowBuilderAction } from './extended-flow-builder'

// Action intended to be used in first interaction, when there is inactivity or when the start over button is clicked
export class StartConversationAction extends ExtendedFlowBuilderAction {
  static contextType = RequestContext
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    const { cmsPlugin, botContext } = getRequestData(request)
    const contents = await cmsPlugin.getStartContents(botContext.locale)
    return super.botonicInit(request, { contentId: contents[0].code })
  }
}
