import {
  type BotContext,
  EventAction,
  type EventConditionalChannel,
} from '@botonic/core'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtChannelConditionalNode } from './hubtype-fields/channel-conditional'
import type { HtFunctionResult } from './hubtype-fields/function'

export class FlowChannelConditional extends ContentFieldsBase {
  public resultMapping: HtFunctionResult[] = []
  public conditionalResult?: HtFunctionResult = undefined
  public channelResult: string = ''

  static fromHubtypeCMS(
    component: HtChannelConditionalNode,
    botContext: BotContext
  ): FlowChannelConditional {
    const newChannelConditional = new FlowChannelConditional(component.id)
    newChannelConditional.code = component.code
    newChannelConditional.resultMapping = component.content.result_mapping
    newChannelConditional.setConditionalResult(botContext)

    return newChannelConditional
  }

  setConditionalResult(botContext: BotContext): void {
    const provider = botContext.session.user.provider
    const conditionalResult =
      this.resultMapping.find(rMap => rMap.result === provider) ||
      this.resultMapping.find(rMap => rMap.result === 'default')
    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with channel: ${provider}`
      )
    }
    this.conditionalResult = conditionalResult
    this.channelResult = conditionalResult.result as string
    this.followUp = conditionalResult.target
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const eventChannelConditional: EventConditionalChannel = {
      action: EventAction.ConditionalChannel,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      channel: this.channelResult,
    }
    const { action, ...eventArgs } = eventChannelConditional
    await trackEvent(botContext, action, eventArgs)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
