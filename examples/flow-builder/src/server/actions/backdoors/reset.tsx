import { FlowBuilderActionProps } from '@botonic/plugin-flow-builder'
import { RequestContext } from '@botonic/react'

import { BotRequest } from '../../types'
import { ExtendedFlowBuilderAction } from '../default/extended-flow-builder'

export class ResetBackdoorAction extends ExtendedFlowBuilderAction {
  static contextType = RequestContext

  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    request.session.user.extra_data = {}
    request.session.is_first_interaction = true
    return super.botonicInit(request)
  }
}
