import { FlowBuilderActionProps } from '@botonic/plugin-flow-builder'
import { RequestContext } from '@botonic/react'

import { BotRequest } from '../../types'
import { getPayloadData, getRequestData } from '../../utils/actions'
import { ExtendedFlowBuilderAction } from './extended-flow-builder'

interface PayloadData {
  contentId?: string
}

//Action intended to be used to render a specific content by its content id (useful to be executed from webviews and custom messages)
export class ContentIdAction extends ExtendedFlowBuilderAction {
  static contextType = RequestContext
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    const { payload } = getRequestData(request)
    const { contentId } = getPayloadData<PayloadData>(payload)

    return super.botonicInit(request, { contentId })
  }
}
