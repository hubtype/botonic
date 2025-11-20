import { ActionRequest } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtChannelConditionalNode } from './hubtype-fields/channel-conditional'
import { HtFunctionResult } from './hubtype-fields/function'

export class FlowChannelConditional extends ContentFieldsBase {
  public resultMapping: HtFunctionResult[] = []
  public conditionalResult?: HtFunctionResult = undefined

  static fromHubtypeCMS(
    component: HtChannelConditionalNode,
    request: ActionRequest
  ): FlowChannelConditional {
    const newChannelConditional = new FlowChannelConditional(component.id)
    newChannelConditional.code = component.code
    newChannelConditional.resultMapping = component.content.result_mapping
    newChannelConditional.setConditionalResult(request)

    return newChannelConditional
  }

  setConditionalResult(request: ActionRequest): void {
    const provider = request.session.user.provider
    const conditionalResult =
      this.resultMapping.find(rMap => rMap.result === provider) ||
      this.resultMapping.find(rMap => rMap.result === 'default')
    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with channel: ${provider}`
      )
    }
    this.conditionalResult = conditionalResult
    this.followUp = conditionalResult.target
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // TODO: Implement tracking for channel conditional
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toBotonic(_id: string, _request: ActionRequest): JSX.Element {
    return <></>
  }
}
