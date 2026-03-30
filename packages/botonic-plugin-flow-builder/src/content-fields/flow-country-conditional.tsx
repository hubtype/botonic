import {
  type BotContext,
  EventAction,
  type EventConditionalCountry,
} from '@botonic/core'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtFunctionResult } from './hubtype-fields'
import type { HtCountryConditionalNode } from './hubtype-fields/country-conditional'

export class FlowCountryConditional extends ContentFieldsBase {
  public resultMapping: HtFunctionResult[] = []
  public conditionalResult?: HtFunctionResult = undefined

  static fromHubtypeCMS(
    component: HtCountryConditionalNode,
    botContext: BotContext
  ): FlowCountryConditional {
    const newCountryConditional = new FlowCountryConditional(component.id)
    newCountryConditional.code = component.code
    newCountryConditional.resultMapping = component.content.result_mapping
    newCountryConditional.setConditionalResult(botContext)

    return newCountryConditional
  }

  setConditionalResult(botContext: BotContext): void {
    const country = botContext.getUserCountry()
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

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)
    if (!this.conditionalResult?.result) {
      console.warn(
        `Tracking event for node ${this.code} but no conditional result found`
      )
    }
    const eventCountryConditional: EventConditionalCountry = {
      action: EventAction.ConditionalCountry,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      country: (this.conditionalResult?.result as string) ?? '',
    }
    const { action, ...eventArgs } = eventCountryConditional
    await trackEvent(botContext, action, eventArgs)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
