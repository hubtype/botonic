import { EventAction, EventConditionalCountry } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import React from 'react'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtFunctionResult } from './hubtype-fields'
import { HtCountryConditionalNode } from './hubtype-fields/country-conditional'

export class FlowCountryConditional extends ContentFieldsBase {
  public resultMapping: HtFunctionResult[] = []
  public conditionalResult?: HtFunctionResult = undefined

  static fromHubtypeCMS(
    component: HtCountryConditionalNode,
    request: ActionRequest
  ): FlowCountryConditional {
    console.log('FlowCountryConditional fromHubtypeCMS', { component })
    const newCountryConditional = new FlowCountryConditional(component.id)
    newCountryConditional.code = component.code
    newCountryConditional.resultMapping = component.content.result_mapping
    newCountryConditional.setConditionalResult(request)

    return newCountryConditional
  }

  setConditionalResult(request: ActionRequest): void {
    const country = request.getUserCountry()
    const conditionalResult =
      this.resultMapping.find(rMap => rMap.result === country) ||
      this.resultMapping.find(rMap => rMap.result === 'default')
    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with country: ${country}`
      )
    }
    this.conditionalResult = conditionalResult
    this.followUp = conditionalResult.target
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    const { flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)
    if (!this.conditionalResult?.result) {
      console.warn(
        `Tracking event for node ${this.code} but no conditional result found`
      )
    }
    const eventCountryConditional: EventConditionalCountry = {
      action: EventAction.ConditionalCountry,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      country: this.conditionalResult?.result ?? '',
    }
    const { action, ...eventArgs } = eventCountryConditional
    await trackEvent(request, action, eventArgs)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toBotonic(_id: string, _request: ActionRequest): JSX.Element {
    return <></>
  }
}
